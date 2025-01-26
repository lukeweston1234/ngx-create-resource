# NgxCreateResource

This is a lightweight wrapper for async and observable functions, with plans to extend to Angular Signals in the future.

This library takes heavy inspiration from SolidJS' createResource function, the goal being to add refetch and mutate functionality, as well as error and loading states to any asynchronous or observable data fetching function.

### Examples

```typescript
@Component({
    selector: "app-cars-dashboard",
    templateUrl: "./cars-dashboard.component.html",
    imports: [CommonModule],
    standalone: true
})
export class CarsDashboard(){
    cars: Resource<Car[]>;
    prices: Resource<Price[]>
    constructor(private carsService: CarService, private priceService: PriceService){
        // Resource from Observable
        this.cars = createResource(this.carsService.get()); 
        // Resource from async
        this.prices = createResourceFromAsync(this.priceService.get()); 
    }
    //refetch example
    async deleteCar(carId: string){
        await this.carsService.delete();
        this.cars.refetch();
    }
    //mutate example
    async addCar(newCar: car){
        const res = await this.carsService.add(newCar);
        // We could refetch, but maybe we want to mutate state instead
        this.cars.mutate([...this.cars.data, newCar])
    }
}

// In our template

<div *ngIf="!cars.loading">
    <div *ngFor="let car of cars$ | async>
        <h2>{{car.name}}</h2>
    </div>
</div>
<div *ngIf="cars.error">
    <span>Internal Error</span>
</div>
<div *ngIf="cars.loading>
    <spinner />
</div>
```
