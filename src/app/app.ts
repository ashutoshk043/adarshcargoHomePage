import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

type PageId = 'home' | 'about' | 'services' | 'track' | 'quote' | 'faq' | 'contact';

interface Shipment {
  status: string;
  badgeClass: string;
  location: string;
  eta: string;
  steps: { state: 'done' | 'current' | 'pending'; title: string; subtitle: string }[];
}

interface QuoteResult {
  actual: string;
  volumetric: string;
  billable: string;
  base: string;
  fuel: string;
  handling: string;
  discount: string;
  gst: string;
  total: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  readonly title = 'CargoLine';
  readonly navItems: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'track', label: 'Track Shipment' },
    { id: 'quote', label: 'Get Quote' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' },
  ];

  currentPage: PageId = 'home';
  mobileMenuOpen = false;
  loginOpen = false;
  authMode: 'login' | 'register' | 'forgot' = 'login';
  authStep: 'form' | 'otp' = 'form';
  authMessage = '';
  authMessageType: 'info' | 'success' | 'danger' = 'info';

  authEmailOrPhone = '';
  authPassword = '';
  authName = '';
  authPhone = '';
  authOtp = '';
  forgotEmail = '';
  forgotPhone = '';

  contactName = '';
  contactEmail = '';
  contactPhone = '';
  contactMessage = '';
  contactSubmitted = false;
  newsletterEmail = '';
  newsletterSubmitted = false;

  trackInput = 'CGR-2026-00001245';
  trackResult: Shipment | null = null;
  trackNotFound = false;

  pickupPincode = '';
  deliveryPincode = '';
  serviceType: 'standard' | 'express' = 'standard';
  weight = 4.2;
  quantity = 1;
  length = 30;
  width = 20;
  height = 15;
  coupon = '';
  quoteError = '';
  quoteResult: QuoteResult | null = null;

  carouselIndex = 0;
  readonly testimonials = [
    {
      quote: 'We moved our entire regional dispatch onto CargoLine. Visibility into every hub handoff cut our customer complaints in half.',
      name: 'Nikhil Rao',
      role: 'Ops Head, Nirvana Retail',
      avatar: 'https://i.pravatar.cc/88?img=13',
    },
    {
      quote: 'Express lanes consistently beat their own SLA. Our perishables reach Lucknow a full day faster than before.',
      name: 'Sana Patel',
      role: 'Supply Chain Lead, Velocity Foods',
      avatar: 'https://i.pravatar.cc/88?img=47',
    },
    {
      quote: 'The pricing breakdown is the first one that has ever made sense to our finance team — no surprise surcharges at reconciliation.',
      name: 'Arjun Kapoor',
      role: 'Finance Manager, Orbital Electronics',
      avatar: 'https://i.pravatar.cc/88?img=33',
    },
  ];

  readonly faqData = [
    ['How is billable weight calculated?', 'We charge the greater of actual weight and volumetric weight (length × width × height ÷ 5000), rounded up to the nearest 0.5 kg.'],
    ['Can I schedule a pickup for tomorrow?', 'Yes — pickups can be scheduled up to 7 days in advance from the Create Shipment flow.'],
    ['What happens if a delivery attempt fails?', 'We reattempt up to 3 times over 3 business days, and notify you after every attempt before initiating RTO.'],
    ['Do you support Cash on Delivery?', 'Yes, COD is available on Standard and Express services with settlement within 5 business days.'],
    ['Which areas do you currently serve?', 'Over 4,200 pincodes across India, spanning 46 branches and 9 regional hubs.'],
    ['How do I get an invoice for my shipment?', 'Invoices are generated automatically after payment and available for download from your shipment details page.'],
    ['Can I change the delivery address after booking?', 'Address changes are possible before the shipment is picked up — contact support as soon as possible.'],
    ['What if my parcel is damaged in transit?', 'All shipments are covered by our standard liability policy; claims can be raised from your shipment history within 48 hours of delivery.'],
  ];

  readonly shipmentDB: Record<string, Shipment> = {
    'CGR-2026-00001245': {
      status: 'In Transit',
      badgeClass: 'badge-warning',
      location: 'Lucknow Hub',
      eta: '15 September',
      steps: [
        { state: 'done', title: 'Booking Created', subtitle: 'New Delhi Branch — 12 Sep, 9:04 AM' },
        { state: 'done', title: 'Picked Up', subtitle: 'New Delhi Branch — 12 Sep, 11:20 AM' },
        { state: 'done', title: 'Origin Hub', subtitle: 'New Delhi Hub — 12 Sep, 6:40 PM' },
        { state: 'current', title: 'In Transit', subtitle: 'En route to Lucknow Hub' },
        { state: 'pending', title: 'Out for Delivery', subtitle: 'Pending' },
        { state: 'pending', title: 'Delivered', subtitle: 'Pending' },
      ],
    },
    'CGR-2026-00001190': {
      status: 'Delivered',
      badgeClass: 'badge-success',
      location: 'Delivered to recipient',
      eta: '11 September',
      steps: [
        { state: 'done', title: 'Booking Created', subtitle: 'New Delhi Branch — 09 Sep, 10:02 AM' },
        { state: 'done', title: 'Picked Up', subtitle: 'New Delhi Branch — 09 Sep, 1:15 PM' },
        { state: 'done', title: 'Out for Delivery', subtitle: 'Pune — 11 Sep, 9:00 AM' },
        { state: 'done', title: 'Delivered', subtitle: 'Pune — 11 Sep, 3:40 PM' },
      ],
    },
  };

  readonly serviceCards = [
    { image: 'https://picsum.photos/seed/parcel1/600/360', icon: 'S', title: 'Standard Delivery', text: '3–5 day network delivery for general cargo, priced by billable weight.' },
    { image: 'https://picsum.photos/seed/courier1/600/360', icon: 'E', title: 'Express Delivery', text: '1–2 day priority lanes for time-sensitive freight with dedicated handling.' },
    { image: 'https://picsum.photos/seed/cargotruck2/600/360', icon: 'C', title: 'Cargo Transportation', text: 'Full and part truckload transport between hubs, scheduled or on-demand.' },
    { image: 'https://picsum.photos/seed/officelogistics1/600/360', icon: 'B', title: 'Business Logistics', text: 'Contracted rates, dedicated account manager and consolidated billing.' },
    { image: 'https://picsum.photos/seed/warehouse1/600/360', icon: 'W', title: 'Warehouse Services', text: 'Storage, sorting and fulfillment support across regional hub networks.' },
  ];

  private carouselTimer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    // Do not start browser timers while Angular is rendering on the server.
    if (typeof window !== 'undefined') {
      this.carouselTimer = setInterval(() => this.carouselMove(1), 5000);
    }
  }

  ngOnDestroy(): void {
    if (this.carouselTimer) clearInterval(this.carouselTimer);
  }

  goPage(page: PageId): void {
    this.currentPage = page;
    this.mobileMenuOpen = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  openLogin(mode: 'login' | 'register' | 'forgot' = 'login'): void {
    this.loginOpen = true;
    this.authMode = mode;
    this.authStep = 'form';
    this.authMessage = '';
    this.authOtp = '';
  }

  closeLogin(): void {
    this.loginOpen = false;
    this.authStep = 'form';
    this.authMessage = '';
  }

  switchAuthMode(mode: 'login' | 'register' | 'forgot'): void {
    this.authMode = mode;
    this.authStep = 'form';
    this.authMessage = '';
    this.authOtp = '';
  }

  requestOtp(): void {
    this.authMessage = '';
    if (this.authMode === 'login' && (!this.authEmailOrPhone.trim() || !this.authPassword.trim())) {
      this.showAuthMessage('Please enter email/phone and password first.', 'danger');
      return;
    }

    if (this.authMode === 'register' && (!this.authName.trim() || !this.authPhone.trim() || !this.authEmailOrPhone.trim() || !this.authPassword.trim())) {
      this.showAuthMessage('Please complete all required registration fields.', 'danger');
      return;
    }

    if (this.authMode === 'forgot' && (!this.forgotEmail.trim() || !this.forgotPhone.trim())) {
      this.showAuthMessage('Please enter both email and mobile number.', 'danger');
      return;
    }

    this.authStep = 'otp';
    this.showAuthMessage(
      this.authMode === 'forgot'
        ? 'Demo OTP generated for email + mobile verification. Connect your SMS/email provider in the Node.js API for real delivery.'
        : 'Demo OTP generated for mobile verification. Connect your SMS provider in the Node.js API for real delivery.',
      'info',
    );
  }

  verifyOtp(): void {
    if (!/^\d{4,6}$/.test(this.authOtp.trim())) {
      this.showAuthMessage('Please enter a valid 4–6 digit OTP.', 'danger');
      return;
    }

    this.showAuthMessage('OTP verified successfully. Your demo flow is complete.', 'success');
    setTimeout(() => this.closeLogin(), 900);
  }

  private showAuthMessage(message: string, type: 'info' | 'success' | 'danger'): void {
    this.authMessage = message;
    this.authMessageType = type;
  }

  carouselGo(index: number): void {
    this.carouselIndex = index;
  }

  carouselMove(direction: number): void {
    this.carouselIndex = (this.carouselIndex + direction + this.testimonials.length) % this.testimonials.length;
  }

  runTrack(): void {
    const awb = this.trackInput.trim().toUpperCase();
    this.trackResult = this.shipmentDB[awb] ?? null;
    this.trackNotFound = !this.trackResult;
  }

  calcQuote(): void {
    this.quoteError = '';
    this.quoteResult = null;

    if (!/^\d{6}$/.test(this.pickupPincode) || !/^\d{6}$/.test(this.deliveryPincode)) {
      this.quoteError = 'Please enter valid 6-digit pickup and delivery pincodes.';
      return;
    }

    const safeWeight = Number(this.weight) || 0;
    const safeQty = Math.max(Number(this.quantity) || 1, 1);
    const L = Math.max(Number(this.length) || 0, 0);
    const W = Math.max(Number(this.width) || 0, 0);
    const H = Math.max(Number(this.height) || 0, 0);

    const actualWeight = safeWeight * safeQty;
    const volumetric = (L * W * H * safeQty) / 5000;
    const billable = Math.max(actualWeight, volumetric);
    const ratePerKg = this.serviceType === 'express' ? 65 : 45;
    const base = Math.max(billable * ratePerKg, 150);
    const fuel = base * 0.13;
    const handling = 30;
    const subtotal = base + fuel + handling;

    const code = this.coupon.trim().toUpperCase();
    let discount = 0;
    if (code === 'FIRST50') discount = 50;
    else if (code === 'SAVE10') discount = subtotal * 0.10;

    const afterDiscount = Math.max(subtotal - discount, 0);
    const gst = afterDiscount * 0.18;
    const total = afterDiscount + gst;

    this.quoteResult = {
      actual: `${actualWeight.toFixed(2)} kg`,
      volumetric: `${volumetric.toFixed(2)} kg`,
      billable: `${billable.toFixed(2)} kg`,
      base: `₹${base.toFixed(2)}`,
      fuel: `₹${fuel.toFixed(2)}`,
      handling: `₹${handling.toFixed(2)}`,
      discount: discount > 0 ? `−₹${discount.toFixed(2)}` : '₹0.00',
      gst: `₹${gst.toFixed(2)}`,
      total: `₹${total.toFixed(2)}`,
    };
  }

  submitContact(): void {
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.contactEmail.trim());
    if (!this.contactName.trim() || !validEmail || !this.contactMessage.trim()) {
      this.contactSubmitted = false;
      return;
    }
    this.contactSubmitted = true;
    this.contactName = '';
    this.contactEmail = '';
    this.contactPhone = '';
    this.contactMessage = '';
  }

  subscribeNewsletter(): void {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.newsletterEmail.trim())) return;
    this.newsletterSubmitted = true;
    this.newsletterEmail = '';
  }

  trackEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.runTrack();
  }
}
