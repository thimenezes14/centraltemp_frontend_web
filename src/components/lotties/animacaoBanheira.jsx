import React, { Component } from 'react'
import Lottie from 'react-lottie'
import animationData from './banheira.json';

class AnimacaoBanheira extends Component {


  render(){

    const defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

    return(
      <div>
        <Lottie options={defaultOptions}
              height={250}
              width={250}
              style={
                  {
                      padding: '0',
                      margin: '-40px auto'
                  }
              }
        />
      </div>
    )
  }
}

export default AnimacaoBanheira;