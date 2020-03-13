import React, { useState, useEffect, useRef } from 'react';
import Card from '../UI/Card';
import './Search.css';

// If your function component renders the same result given the same props,
// you can wrap it in a call to React.memo for a performance boost in some cases by memoizing the result.
// This means that React will skip rendering the component, and reuse the last rendered result.
const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      // because of closures, 'enteredFilter' gets locked in when the timer is set
      // we then use a ref to get the most current input value
      // this "debounces" the input so the API call doesn't happen on every keystroke
      if (enteredFilter === inputRef.current.value) {
        const query =
          enteredFilter.length === 0
            ? ''
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
        fetch(
          `https://react-hooks-update.firebaseio.com/ingredients.json${query}`
        )
          .then(response => response.json())
          .then(responseData => {
            const loadedIngredients = [];
            for (const key in responseData) {
              loadedIngredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount
              });
            }
            onLoadIngredients(loadedIngredients);
          });
      }
    }, 500);
    // runs before the next time the effect is executed
    // if the dependency array was empty, it would only run when the component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, onLoadIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
