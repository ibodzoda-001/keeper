import {Component, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {empty} from 'rxjs';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css'],
  providers: [DatePipe]
})
export class TablesComponent implements OnInit {

  arrayOfMeals = [];

  dish = [];
  drink = [];
  dessert = [];
  hookah = [];

  tablesArray = [];

  sumArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  reservedArray = [];

  modalStatus;

  myDate = new Date();
  currentDate = '';


  constructor(private datePipe: DatePipe) {
    this.currentDate = this.datePipe.transform(this.myDate, 'dd-MM-yyyy');
  }

  changeModalStatus(id) {
    this.modalStatus = id;
  }

  addMealToTable(name, price, id) {
    this.reservedArray[this.modalStatus] = 0;
    const count = 1;
    const object = {
      name,
      price,
      count,
      id
    };

    let mealExist = 0;
    let indexOfMeal = 0;
    for (let i = 0; i < this.tablesArray[this.modalStatus].length; i++) {
      if (this.tablesArray[this.modalStatus][i].id === id) {
        mealExist++;
        indexOfMeal = i;
      }
    }
    if (mealExist === 0) {
      this.tablesArray[this.modalStatus].push(object);
    } else {
      this.tablesArray[this.modalStatus][indexOfMeal].count++;
    }
    this.sumArray[this.modalStatus] += price;
    this.insertOrdersData();
    this.insertReserveData();
    this.insertOrdersSumData();
  }

  removeMealFromTable(tableIndex, mealIndex) {
    this.sumArray[tableIndex] -= this.tablesArray[tableIndex][mealIndex].count * this.tablesArray[tableIndex][mealIndex].price;
    this.tablesArray[tableIndex].splice(mealIndex, 1);
    this.insertOrdersData();
    this.insertOrdersSumData();
  }

  getMenuFromStorage() {
    this.arrayOfMeals = JSON.parse(localStorage.getItem('menu'));
  }

  divideMealIntoCategoriesArrays() {
    for (let index = 0; index < this.arrayOfMeals.length; index++) {
      if (this.arrayOfMeals[index].categoryId === '1') {
        this.dish.push(this.arrayOfMeals[index]);
      } else if (this.arrayOfMeals[index].categoryId === '2') {
        this.drink.push(this.arrayOfMeals[index]);
      } else if (this.arrayOfMeals[index].categoryId === '3') {
        this.dessert.push(this.arrayOfMeals[index]);
      } else if (this.arrayOfMeals[index].categoryId === '4') {
        this.hookah.push(this.arrayOfMeals[index]);
      }
    }
  }

  decreaseMealAmount(tableIndex, mealIndex) {
    if (this.tablesArray[tableIndex][mealIndex].count > 1) {
      this.sumArray[tableIndex] -= this.tablesArray[tableIndex][mealIndex].price;
      this.tablesArray[tableIndex][mealIndex].count--;
    }
    this.insertOrdersData();
    this.insertOrdersSumData();
  }

  increaseMealAmount(tableIndex, mealIndex) {
    this.tablesArray[tableIndex][mealIndex].count++;
    this.sumArray[tableIndex] += this.tablesArray[tableIndex][mealIndex].price;
    this.insertOrdersData();
    this.insertOrdersSumData();
  }

  reserveTable() {
    if (this.reservedArray[this.modalStatus] === 0) {
      this.reservedArray[this.modalStatus] = 1;
    } else {
      this.reservedArray[this.modalStatus] = 0;
    }
    this.insertReserveData();
    document.getElementById('close_modal').click();
  }

  insertOrdersData() {
    localStorage.setItem('orders', JSON.stringify(this.tablesArray));
  }

  insertReserveData() {
    localStorage.setItem('reserve', JSON.stringify(this.reservedArray));
  }

  insertOrdersSumData() {
    localStorage.setItem('sum', JSON.stringify(this.sumArray));
  }

  getOrdersData() {
    this.tablesArray = JSON.parse(localStorage.getItem('orders'));
    this.reservedArray = JSON.parse(localStorage.getItem('reserve'));
    this.sumArray = JSON.parse(localStorage.getItem('sum'));
    if (this.reservedArray === null) {
      this.reservedArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    if (this.sumArray === null) {
      this.sumArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    if (this.tablesArray === null) {
      this.tablesArray = [];
      for (let i = 0; i <= 9; i++) {
        this.tablesArray[i] = [];
      }
    }
  }

  payForTable() {
    let oldReport = JSON.parse(localStorage.getItem('report'));
    let oldReportDates = JSON.parse(localStorage.getItem('reportDates'));

    if (oldReportDates === null) {
      oldReportDates = [];
      oldReportDates.push(this.currentDate);
    } else if (oldReportDates[oldReportDates.length - 1] !== this.currentDate) {
      oldReportDates.push(this.currentDate);
    }

    if (oldReport === null) {
      oldReport = [];
    }

    if (oldReport[oldReportDates.length - 1] === undefined) {
      oldReport[oldReportDates.length - 1] = [];
    }

    if (oldReport[oldReportDates.length - 1].length === 0) {
      oldReport[oldReportDates.length - 1] = this.tablesArray[this.modalStatus];
    } else {

      this.tablesArray[this.modalStatus].forEach((meal) => {
        let thereIsAMeal = 0;
        oldReport[oldReportDates.length - 1].forEach((reportElement) => {
          if (reportElement.id === meal.id) {
            reportElement.count = reportElement.count + meal.count;
            thereIsAMeal = 1;
          }
        });
        if (thereIsAMeal === 0) {
          oldReport[oldReportDates.length - 1].push(meal);
        }
      });
    }
    localStorage.setItem('reportDates', JSON.stringify(oldReportDates));
    localStorage.setItem('report', JSON.stringify(oldReport));
    this.tablesArray[this.modalStatus] = [];
    this.sumArray[this.modalStatus] = 0;
    this.insertOrdersData();
    this.insertOrdersSumData();
    document.getElementById('close_modal').click();
    console.log(oldReport[oldReportDates.length - 1]);
  }

  ngOnInit() {
    this.getMenuFromStorage();
    this.divideMealIntoCategoriesArrays();
    this.getOrdersData();
    // localStorage.removeItem('orders');
    // localStorage.removeItem('reserve');
    // localStorage.removeItem('sum');
    // localStorage.removeItem('report');
    // localStorage.removeItem('reportDates');
  }

}
