import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';

import CoinPrice from './CoinPrice';

const URL = 'https://api.coinmarketcap.com/v1/ticker/?convert=IDR&limit=100';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      priceData: [],
      counter: 0,
      width: window.innerWidth
    };
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
    axios
      .get(URL)
      .then(response => {
        const { data } = response;
        this.setState({ priceData: data });
      })
      .catch(error => { throw new Error(error); });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };


  componentDidMount() {
    setInterval(() => {
      const $count = this.state.counter < this.state.priceData.length ?
        this.state.counter+1 : 0;

      this.setState({ counter: $count });
    }, 5000);
  }

  priceGroup(groupCount) {
    const { priceData, counter } = this.state;
    const priceDataChunk = _.chunk(priceData, groupCount);

    const coinPrices = _.chain(priceDataChunk[counter])
      .map(data => {
        const { rank, symbol, name, 
          price_idr: price, 
          percent_change_24h: percentage } = data;

        const props = { 
          rank: _.parseInt(rank), 
          price : _.parseInt(price),
          name, 
          symbol, 
          percentage
        };

        return props;
      })
      .map((data, key) => <CoinPrice key={key} {...data} />)
      .value();

    return coinPrices;
  }

  renderPriceData() {
    if (this.state.priceData.length <= 0) {
      return <div className='has-text-grey-lighter has-text-centered'>Loading...</div>;
    }

    const { width } = this.state;
    const isMobile = width <= 500;

    const groupCount = isMobile ? 1 : 4;

    return this.priceGroup(groupCount);
  }


  render() {
    return this.renderPriceData();
  }
}

export default App;
