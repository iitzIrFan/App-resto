/* eslint-disable */
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const admin = require("firebase-admin");

// Initialize Firebase Admin
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : null;

if (serviceAccount) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
} else {
  // For local dev, uses Application Default Credentials
  admin.initializeApp();
}

const db = admin.firestore();
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
  transports: ["websocket", "polling"],
});

// Track connected clients per order room
const rooms = new Map(); // orderId -> Set<socketId>

io.on("connection", (socket) => {
  console.log(`[Socket] Connected: ${socket.id}`);

  // Join a tracking room for a specific order
  socket.on("join-tracking", ({ orderId, role }) => {
    socket.join(orderId);
    if (!rooms.has(orderId)) rooms.set(orderId, new Set());
    rooms.get(orderId).add(socket.id);
    console.log(`[Socket] ${role} joined room: ${orderId}`);

    // Send current tracking data if available
    db.collection("tracking")
      .doc(orderId)
      .get()
      .then((snap) => {
        if (snap.exists) {
          socket.emit("tracking-data", snap.data());
        }
      });
  });

  // Leave tracking room
  socket.on("leave-tracking", ({ orderId }) => {
    socket.leave(orderId);
    if (rooms.has(orderId)) {
      rooms.get(orderId).delete(socket.id);
      if (rooms.get(orderId).size === 0) rooms.delete(orderId);
    }
  });

  // Delivery boy location update
  socket.on("update-location", async ({ orderId, lat, lng, deliveryBoyId }) => {
    try {
      const trackingRef = db.collection("tracking").doc(orderId);
      const trackingData = {
        orderId,
        deliveryBoyId,
        deliveryBoyLatLng: { lat, lng },
        lastUpdated: new Date().toISOString(),
      };

      // Get order to calculate ETA
      const orderSnap = await db.collection("orders").doc(orderId).get();
      if (orderSnap.exists) {
        const order = orderSnap.data();
        if (order.deliveryAddress?.lat && order.deliveryAddress?.lng) {
          const distance = calculateDistance(
            lat,
            lng,
            order.deliveryAddress.lat,
            order.deliveryAddress.lng,
          );
          trackingData.distanceKm = distance;
          trackingData.etaMinutes = Math.max(
            Math.ceil((distance / 25) * 60),
            2,
          ); // ~25 km/h avg
          trackingData.userLatLng = {
            lat: order.deliveryAddress.lat,
            lng: order.deliveryAddress.lng,
          };
        }
      }

      // Update Firestore
      await trackingRef.set(trackingData, { merge: true });

      // Broadcast to everyone in the room
      io.to(orderId).emit("location-update", trackingData);

      console.log(
        `[Tracking] Order ${orderId}: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      );
    } catch (error) {
      console.error("[Tracking] Error:", error);
    }
  });

  // Order status change
  socket.on("order-status-change", async ({ orderId, status }) => {
    try {
      await db.collection("orders").doc(orderId).update({ status });
      io.to(orderId).emit("status-update", { orderId, status });

      // Clean up tracking on delivery
      if (status === "delivered" || status === "cancelled") {
        io.to(orderId).emit("tracking-ended", { orderId, status });
        rooms.delete(orderId);
      }
    } catch (error) {
      console.error("[Status] Error:", error);
    }
  });

  socket.on("disconnect", () => {
    // Clean up from all rooms
    rooms.forEach((sockets, orderId) => {
      sockets.delete(socket.id);
      if (sockets.size === 0) rooms.delete(orderId);
    });
    console.log(`[Socket] Disconnected: ${socket.id}`);
  });
});

// Haversine distance calculation
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    activeRooms: rooms.size,
    connectedClients: io.sockets.sockets.size,
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`[Tracking Server] Running on port ${PORT}`);
});
