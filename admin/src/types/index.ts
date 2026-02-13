// ─── Admin Roles ───
export type AdminRole = "super_admin" | "order_admin" | "delivery_admin";

export interface AdminUser {
  uid: string;
  email: string;
  role: AdminRole;
  name: string;
}

// ─── Product ───
export interface Product {
  id: string;
  name: string;
  price: number;
  offerPrice?: number;
  description: string;
  category: string;
  imageUrl: string;
  images?: string[];
  isVeg: boolean;
  rating?: number;
  reviewCount?: number;
  preparationTime?: number;
  isAvailable?: boolean;
  tags?: string[];
}

// ─── Order ───
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "picked_up"
  | "on_the_way"
  | "delivered"
  | "cancelled";
export type PaymentMethod = "upi" | "cod";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderAddress {
  label: string;
  fullAddress: string;
  lat: number;
  lng: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  deliveryFee: number;
  discount: number;
  finalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  razorpayPaymentId?: string;
  deliveryAddress: OrderAddress;
  assignedDeliveryBoyId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  couponCode?: string;
  createdAt: string;
  confirmedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancelledBy?: "user" | "admin";
}

// ─── Delivery Boy ───
export interface DeliveryBoy {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleType: "bike" | "scooter" | "bicycle";
  vehicleNumber: string;
  isAvailable: boolean;
  isOnline: boolean;
  currentLocation?: { lat: number; lng: number };
  rating: number;
  totalDeliveries: number;
}

// ─── Offer ───
export interface Offer {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  discountPercent?: number;
  discountFlat?: number;
  minOrderAmount?: number;
  couponCode?: string;
  validFrom: string;
  validTo: string;
  isActive: boolean;
}

// ─── Coupon ───
export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountPercent?: number;
  discountFlat?: number;
  minOrderAmount: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
}

// ─── Tracking ───
export interface TrackingData {
  orderId: string;
  deliveryBoyId: string;
  deliveryBoyLatLng: { lat: number; lng: number };
  userLatLng: { lat: number; lng: number };
  kitchenLatLng: { lat: number; lng: number };
  routePolyline?: [number, number][];
  etaMinutes: number;
  distanceKm: number;
  status: OrderStatus;
  updatedAt: string;
}

// ─── Category ───
export interface Category {
  id: string;
  name: string;
  icon?: string;
  imageUrl?: string;
  order?: number;
}

// ─── Dashboard Stats ───
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  activeOrders: number;
  totalProducts: number;
  totalUsers: number;
  pendingOrders: number;
}
