import {Component, OnInit} from '@angular/core';
import index from '@angular/cli/lib/cli';

@Component({
  selector: 'app-storehouse',
  templateUrl: './storehouse.component.html',
  styleUrls: ['./storehouse.component.css']
})
export class StorehouseComponent implements OnInit {

  name;
  amount = 0;
  storehouse;

  maxId = 0;

  constructor() {
  }

  addNewItemToStorehouse() {
    const object = {
      name: this.name,
      amount: this.amount,
      id: this.maxId + 1
    };
    this.storehouse.push(object);
    this.saveStorehouseData();
    this.name = '';
    this.amount = 0;
  }

  saveStorehouseData() {
    localStorage.setItem('storehouse', JSON.stringify(this.storehouse));
  }

  getStorehouseData() {
    this.storehouse = JSON.parse(localStorage.getItem('storehouse'));
    if (this.storehouse === null) {
      this.storehouse = [];
    } else {
      this.storehouse.forEach((item) => {
        if (this.maxId < item.id) {
          this.maxId = item.id;
        }
      });
    }
  }

  decreaseAmountOfItem(itemId) {
    this.storehouse.forEach((item) => {
      if (itemId === item.id) {
        item.amount--;
      }
    });
    this.saveStorehouseData();
  }

  increaseAmountOfItem(itemId) {
    this.storehouse.forEach((item) => {
      if (itemId === item.id) {
        item.amount++;
      }
    });
    this.saveStorehouseData();
  }

  inputItemAmountFunction(itemId) {
    this.storehouse.forEach((item) => {
      if (itemId === item.id) {
        console.log(item);
        if (item.amount < 0 || item.amount === '' || item.amount === undefined) {
          item.amount = 0;
        }
      }
    });
    this.saveStorehouseData();
  }

  deleteItemFromList(itemId) {
    let indexOfItem;
    this.storehouse.forEach((item, index) => {
      if (itemId === item.id) {
        indexOfItem = index;
      }
    });
    this.storehouse.splice(indexOfItem, 1);
    this.saveStorehouseData();
  }

  ngOnInit() {
    this.getStorehouseData();
  }

}
