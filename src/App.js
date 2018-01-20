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
      counter: 0
    };
  }

  componentWillMount() {
    axios
      .get(URL)
      .then(response => {
        const { data } = response;
        this.setState({ priceData: _.chunk(data, 4) });
      })
      .catch(error => { throw new Error(error); });
  }

  componentDidMount() {
    setInterval(() => {
      const $count = this.state.counter < this.state.priceData.length ?
        this.state.counter+1 : 0;

      this.setState({ counter: $count });
    }, 5000);
  }

  priceGroup() {
    const { priceData, counter } = this.state;
    const coinPrices = _.chain(priceData[counter])
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
      .map(data => <CoinPrice {...data} />)
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
