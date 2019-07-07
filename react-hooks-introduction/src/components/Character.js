// import React, { Component } from 'react';
import React, { useState, useEffect } from "react";
import { useHttp } from "../hooks/http";
import Summary from './Summary';

const Character = (props) => {
  // state = { loadedCharacter: {}, isLoading: false };
  // const [loadedCharacter, setLoadedCharacter] = useState({});
  // const [isLoading, setIsLoading] = useState(false);

  // const [state, setState] = useState({
  //   loadedCharacter: {},
  //   isLoading: false
  // })

  console.log("Rendering...");
  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log('shouldComponentUpdate');
  //   return (
  //     nextProps.selectedChar !== this.props.selectedChar ||
  //     nextState.loadedCharacter.id !== this.state.loadedCharacter.id ||
  //     nextState.isLoading !== this.state.isLoading
  //   );
  // }
  // const fetchData = () => {
  //   console.log(
  //     'Sending Http request for new character with id ' +
  //       props.selectedChar
  //   );
  //   // setIsLoading(true);
  //   setState({
  //     ...state,
  //     isLoading: true
  //   })
  //   fetch('https://swapi.co/api/people/' + props.selectedChar)
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error('Could not fetch person!');
  //       }
  //       return response.json();
  //     })
  //     .then(charData => {
  //       const loadedCharacter = {
  //         id: props.selectedChar,
  //         name: charData.name,
  //         height: charData.height,
  //         colors: {
  //           hair: charData.hair_color,
  //           skin: charData.skin_color
  //         },
  //         gender: charData.gender,
  //         movieCount: charData.films.length
  //       };
  //       // this.setState({ loadedCharacter: loadedCharacter, isLoading: false });
  //       // setLoadedCharacter(loadedCharacter);
  //       // setIsLoading(false);
  //       setState({
  //         ...state,
  //         loadedCharacter,
  //         isLoading: false
  //       })
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // };
  const [isLoading, fetchedData] = useHttp('https://swapi.co/api/people/' + props.selectedChar, [props.selectedChar])
  // useEffect(() => {
  //   fetchData();
  //   return () => {
  //     console.log("cleaning up...")
  //   }
  // }, [props.selectedChar])
  let loadedCharacter = null;
  if(fetchedData) {
    loadedCharacter = {
      id: props.selectedChar,
      name: fetchedData.name,
      height: fetchedData.height,
      colors: {
        hair: fetchedData.hair_color,
        skin: fetchedData.skin_color
      },
      gender: fetchedData.gender,
      movieCount: fetchedData.films.length
    };
  }

  useEffect(() => {
    return () => {
      console.log("component did unmount");
    }
  },[])
  // componentDidUpdate(prevProps) {
  //   console.log('Component did update');
  //   if (prevProps.selectedChar !== this.props.selectedChar) {
  //     this.fetchData();
  //   }
  // }

  // componentDidMount() {
  //   this.fetchData();
  // }

  // componentWillUnmount() {
  //   console.log('Too soon...');
  // }

  
  let content = <p>Loading Character...</p>;

  if (!isLoading && loadedCharacter) {
    content = (
      <Summary
        name={loadedCharacter.name}
        gender={loadedCharacter.gender}
        height={loadedCharacter.height}
        hairColor={loadedCharacter.colors.hair}
        skinColor={loadedCharacter.colors.skin}
        movieCount={loadedCharacter.movieCount}
      />
    );
  } else if (!isLoading && !loadedCharacter) {
    content = <p>Failed to fetch character.</p>;
  }
  return content;
  
}

export default React.memo(Character);
