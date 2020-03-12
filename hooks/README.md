# React Hook Reference - Examples

### the dependency array
``` javascript
const MyComponent = () => {
  // This function doesn't close over state at this moment
  function logData() {
    console.log('logData')
  }

  useEffect(() => {
    logData()
  }, []) // `logData` not required in the dependency array

  // ...
}
```

Then we console.log some props:

``` javascript
const MyComponent = ({ data }) => {
  // This function DOES close over state now (remember, props
  // are someone else's state)
  function logData() {
    console.log(data)
  }

  useEffect(() => {
    logData()
  }, [logData]) // Now we add it here

  // ...
}
```

Now that logData is in the dependency array, the new concern is that this function will change with every re-render of MyComponent. So we need to use useCallback:

``` javascript
const MyComponent = ({ data }) => {
  const logData = useCallback(() => {
    console.log(data)
  }, [data])

  useEffect(() => {
    logData()
  }, [logData]) // Now we add it here

  // ...
}
```

Or, we can do this:

``` javascript
const MyComponent = ({ data }) => {
  useEffect(() => {
    function logData() {
      console.log(data)
    }
    logData()
  }, [data]) // Now, just `data` is needed here

  // ...
}
```

logData does close over state, but it's apart of the effect itself so we don't need anything but data in the array.

