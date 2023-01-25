import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Cart, CartItem } from "src/app/models/cart.model";
import { CartService } from "src/app/services/cart.service";

import { loadStripe } from "@stripe/stripe-js";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
})
export class CartComponent implements OnInit {
  cart: Cart = {
    items: [
      {
        product: "https://via.placeholder.com/150",
        name: "sneakers",
        price: 150,
        quantity: 2,
        id: 1,
      },
      {
        product: "https://via.placeholder.com/150",
        name: "sneakers",
        price: 150,
        quantity: 1,
        id: 2,
      },
    ],
  };
  dataSource: Array<CartItem> = [];
  displayedColumns: Array<string> = [
    "product",
    "name",
    "price",
    "quantity",
    "total",
    "action",
  ];

  constructor(private cartSvc: CartService, private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.cartSvc.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    });
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartSvc.getTotal(items);
  }

  onClearCart(): void {
    this.cartSvc.clearCart();
  }

  onRemoveFromCart(item: CartItem): void {
    this.cartSvc.removeFromCart(item);
  }

  onAddQuantity(item: CartItem): void {
    this.cartSvc.addToCart(item);
  }

  onRemoveQuantity(item: CartItem): void {
    this.cartSvc.removeQuantity(item);
  }

  onCheckout(): void {
    this.httpClient
      .post("http://localhost:4242/checkout/", {
        items: this.cart.items,
      })
      .subscribe(async (res: any) => {
        let stripe = await loadStripe(
          "sk_test_51MUBJAIeDAlGNAb5ORa92KabvlGlUEixdhL1G7Mbl98W3bWjbae8gNtbmWloILhB2xP0RH5h4uKCdiAj1Ae5Rzkh009gzRl2nx"
        );
        stripe?.redirectToCheckout({
          sessionId: res.id,
        });
      });
  }
}
