import { forkJoin, merge, of } from "rxjs"
import { catchError, delay, map } from "rxjs/operators"
import { throwError, concat } from "rxjs"

function randomTime() {
  return Math.floor(Math.random() * 2000) /* times number of milliseconds */
}

function postRequest(id?: number) {
  if (Math.random() > 0.5) {
    return of({ id })
  } else return throwError(new Error(`Error from ${id}!`))
}

const apiResponse1 = postRequest(1).pipe(
  delay(randomTime()), // only to mimick async
  map((response) => {
    console.log("report succes:", response)
    return "success"
  }), //tap will not modify; also do not return the observable here
  catchError((error) => {
    console.log("error caught: ", error.message)
    return of("error")
  })
)

const apiResponse2 = postRequest(2).pipe(
  delay(randomTime()), // only to mimick async
  map((response) => {
    console.log("report succes:", response)
    return "success"
  }), //tap will not modify; also do not return the observable here
  catchError((error) => {
    console.log("error caught: ", error.message)
    return of("error")
  })
)

// apiResponse1.subscribe(
//   (r) => console.log("single subscribe 1", r),
//   (error) => console.log(error)
// )

// apiResponse2.subscribe(
//   (r) => console.log("single subscribe 2", r),
//   (error) => console.log(error)
// )

// merge(apiResponse1, apiResponse2).subscribe(
//   (x) => console.log("merge", x),
//   (e) => console.log(e)
// )

// concat(apiResponse1, apiResponse2).subscribe(
//   (x) => console.log("concat", x),
//   (e) => console.log(e)
// )

// forkJoin([apiResponse1, apiResponse2]).subscribe(
//   (x) => console.log("forkJoin", x),
//   (e) => console.error(e)
// )

forkJoin([apiResponse1, apiResponse2]).subscribe(
  (outputs) => {
    const bsnStatus = outputs.every((o) => o === "success") ? "allBsnReceived" : "someBnError"
    const bsnStep = "finalStep"
    console.log(outputs)
    console.log(bsnStatus)
    console.log(bsnStep)
  },
  (e) => console.error(e)
)
