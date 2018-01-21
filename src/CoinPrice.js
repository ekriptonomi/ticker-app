import React, { Component } from 'react';
import PropTypes from 'prop-types';
import formatCurrency from 'format-currency';
import styled, { keyframes } from 'styled-components';

const fadeInOpacity = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1;}
`;

const FadeIn = styled.div`
  opacity: 1;
  animation-name: ${fadeInOpacity};
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: 0.5s;
`;

const Icon = ({ symbol }) => {
  const source = require(`./icons/svg/color/${symbol.toLowerCase()}.svg`);
  return <img alt={symbol} className="icon" src={source} />;
};

const Heading = ({ rank, name, symbol }) => 
  <p className="heading">#{ rank }. {name} ({symbol}) </p>;

const Price = ({ value, currencySymbol }) => {
  const opts = { 
    format: '%s %v', 
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    symbol: currencySymbol,
    locale: 'id-ID'
  };

  const formattedPrice = formatCurrency(value, opts);
  return <span className="has-text-white-ter">{ formattedPrice }</span>;
};


const PercentChange = ({ value }) => {
  const formattedValue = `${value}%`;
  
  return (
    <small className="is-size-7 has-text-success">
      <span className="icon"><i className="fa fa-caret-up" aria-hidden="true"></i></span> 
      {formattedValue}
    </small>
  );
};

export default class CoinPrice extends Component {
  render() {
    const { rank, name, symbol, price, percentage } = this.props;
    return (
      <div className="level-item has-text-centered">
        <FadeIn>
          <Heading rank={rank} name={name} symbol={symbol} />
          <p className="title" >
            <Icon symbol={symbol} />
            <Price value={price} currencySymbol="Rp" />
            <PercentChange value={percentage} />
          </p>
        </FadeIn>
      </div>
    );
  }
}

CoinPrice.propTypes = {
  rank: PropTypes.number,
  name: PropTypes.string,
  symbol : PropTypes.string,
  price: PropTypes.number,
  percentage: PropTypes.number
};

Icon.propTypes = {
  symbol: PropTypes.string
};

Heading.propTypes = {
  rank: PropTypes.number,
  name: PropTypes.string,
  symbol: PropTypes.string
};

Price.propTypes = {
  value: PropTypes.number,
  currencySymbol: PropTypes.string
};

PercentChange.propTypes = {
  value: PropTypes.number
};