// import React, { Component } from 'react';
import React, { useState, useEffect } from "react";
import { useHttp } from "../hooks/http";
import './CharPicker.css';

const CharPicker = (props) => {
  // state = { characters: [], isLoading: false };
  // const [characters, setCharacters] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);

  const [isLoading, fetchedData] = useHttp('https://swapi.co/api/people', []);

  // useEffect(() => {
  //   setIsLoading(true);
  //   fetch('https://swapi.co/api/people')
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch.');
  //       }
  //       return response.json();
  //     })
  //     .then(charData => {
  //       const selectedCharacters = charData.results.slice(0, 5);
  //       setCharacters(selectedCharacters.map((char, index) => ({
  //         name: char.name,
  //         id: index + 1
  //       })))
  //       setIsLoading(false);
  //       // this.setState({
  //       //   characters: selectedCharacters.map((char, index) => ({
  //       //     name: char.name,
  //       //     id: index + 1
  //       //   })),
  //       //   isLoading: false
  //       // });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }, []);

  let characters = null;
  if(fetchedData) {
    const selectedCharacters = fetchedData.results.slice(0, 5);
    characters = selectedCharacters.map((char, index) => ({
      name: char.name,
      id: index + 1
    }))
  }
  // componentDidMount() {
  //   this.setState({ isLoading: true });
  //   fetch('https://swapi.co/api/people')
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch.');
  //       }
  //       return response.json();
  //     })
  //     .then(charData => {
  //       const selectedCharacters = charData.results.slice(0, 5);
  //       this.setState({
  //         characters: selectedCharacters.map((char, index) => ({
  //           name: char.name,
  //           id: index + 1
  //         })),
  //         isLoading: false
  //       });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }

  
  let content = <p>Loading characters...</p>;

  if (
    !isLoading &&
    characters &&
    characters.length > 0
  ) {
    content = (
      <select
        onChange={props.onCharSelect}
        value={props.selectedChar}
        className={props.side}
      >
        {characters.map(char => (
          <option key={char.id} value={char.id}>
            {char.name}
          </option>
        ))}
      </select>
    );
  } else if (
    !isLoading &&
    (!characters || characters.length === 0)
  ) {
    content = <p>Could not fetch any data.</p>;
  }
  return content;
  
}

export default CharPicker;
