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
    this.fetchPrice();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange () {
    this.setState({ width: window.innerWidth });
  }

  fetchPrice () {
    axios.get(URL).then(response => {
      const { data } = response;
      this.setState({ priceData: data });
    }).catch(error => { 
      throw new Error(error); 
    });
  }

  updateCounter () {
    const $count = this.state.counter < this.state.priceData.length ?
      this.state.counter+1 : 0;

    this.setState({ counter: $count });
  }

  componentDidMount() {
    const millisInSecond = 1000;
    const fiveSeconds = millisInSecond * 5;
    const tenMinutes = millisInSecond * 60 * 10;

    setInterval(() => this.updateCounter(), fiveSeconds);
    setInterval(() => this.fetchPrice(), tenMinutes);
  }

  priceGroup() {
    const { width } = this.state;
    let groupCount = 4;
    if (width <= 1400) groupCount = 3;
    if (width <= 1000) groupCount = 2;
    if (width <= 500) groupCount = 1;

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
          percentage: parseFloat(percentage),
          name, 
          symbol, 
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

    return this.priceGroup();
  }


  render() {
    return this.renderPriceData();
  }
}

export default App;
