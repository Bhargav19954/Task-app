

//   console.log('Processed in the  iteration');
// function cb(){
//     console.log('Processed in next iteration');
//   }
//   process.nextTick(cb);
//   console.log('Processed in the first iteration');

const myFunction = () => {
    // do something
    console.log('Processed in the first iteration');

    setTimeout(myFunction, 1000)
  }
  
  setTimeout(myFunction, 1000)