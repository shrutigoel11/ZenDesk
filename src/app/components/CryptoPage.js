'use client'

import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import logo from '../logo.png';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Zoom,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

const Container = styled(motion.div)`
  min-height: 100vh;
  color: white;
  font-family: 'Poppins', sans-serif;
  position: relative;
  z-index: 2;
  background: linear-gradient(to bottom, #0a0015, #1a0030);
`;

const Header = styled(motion.header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 3rem;
  background-color: rgba(10, 0, 21, 0.8);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Logo = styled(motion.div)`
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const NavLink = styled(motion.a)`
  color: white;
  text-decoration: none;
  font-weight: 700;
  font-family: 'Montserrat', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    width: ${props => props.isActive ? '100%' : '0'};
    height: 2px;
    bottom: -5px;
    left: 0;
    background-color: #ff4d6d;
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const MainContent = styled(motion.main)`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled(motion.h1)`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #ff4d6d, #4d79ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.1);
`;

const Td = styled.td`
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-top: 2rem;
`;

const Select = styled.select`
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.5rem;
  border-radius: 5px;
  border: none;
  margin-right: 1rem;
`;

const Input = styled.input`
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.5rem;
  border-radius: 5px;
  border: none;
  margin-right: 1rem;
`;

const Button = styled.button`
  background-color: #ff4d6d;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #ff3d5d;
    box-shadow: 0 0 15px #ff4d6d;
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background-color: #1a0030;
  padding: 2rem;
  border-radius: 10px;
  width: 80%;
  height: 80%;
`;

const StyledSelect = styled(Select)`
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,<svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L7 7L13 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  background-repeat: no-repeat;
  background-position: right 0.7rem top 50%;
  background-size: 0.65rem auto;
  padding-right: 2rem;

  &::-ms-expand {
    display: none;
  }

  option {
    background-color: #1a0030;
  }
`;

const StyledDateInput = styled(Input)`
  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
  }
`;

const SearchBar = styled(Input)`
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.75rem;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #ff4d6d;
    box-shadow: 0 0 10px rgba(255, 77, 109, 0.5);
  }
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.5, 
      when: "beforeChildren",
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};
export default function CryptoPage() {
  const [cryptoData, setCryptoData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [timeFrame, setTimeFrame] = useState('30');
  const [amount, setAmount] = useState(1);
  const [convertFrom, setConvertFrom] = useState('USD');
  const [convertTo, setConvertTo] = useState('BTC');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investmentDate, setInvestmentDate] = useState('');
  const [investmentCrypto, setInvestmentCrypto] = useState('bitcoin');
  const [investmentCurrency, setInvestmentCurrency] = useState('USD');
  const [currentValue, setCurrentValue] = useState(null);
  const [profitLoss, setProfitLoss] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetchCryptoData();
    fetchChartData();
  }, [selectedCrypto, timeFrame]);

  const fetchCryptoData = async () => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 250,
          page: 1,
          sparkline: false,
        },
      });
      setCryptoData(response.data);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
    }
  };

  const fetchChartData = async () => {
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${selectedCrypto}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days: timeFrame,
        },
      });
      const prices = response.data.prices;
      const labels = prices.map(price => new Date(price[0]).toLocaleDateString());
      const data = prices.map(price => price[1]);

      setChartData({
        labels,
        datasets: [
          {
            label: `${selectedCrypto.charAt(0).toUpperCase() + selectedCrypto.slice(1)} Price`,
            data,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  const handleConvert = async () => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/exchange_rates');
      const rates = response.data.rates;
      const fromRate = rates[convertFrom.toLowerCase()].value;
      const toRate = rates[convertTo.toLowerCase()].value;
      const converted = (amount / fromRate) * toRate;
      setConvertedAmount(converted);
    } catch (error) {
      console.error('Error converting currency:', error);
    }
  };

  const handleInvestmentCalculation = () => {
    if (!investmentAmount || !investmentDate || !investmentCrypto) {
      alert("Please fill in all fields");
      return;
    }

    const selectedCrypto = cryptoData.find(crypto => crypto.id === investmentCrypto);
    if (!selectedCrypto) {
      alert("Selected cryptocurrency not found in data");
      return;
    }

    const currentPrice = selectedCrypto.current_price;
    const investedAmount = parseFloat(investmentAmount);
    const investedDate = new Date(investmentDate);
    const today = new Date();

    if (investedDate > today) {
      alert("Investment date cannot be in the future");
      return;
    }

    // Calculate time difference in days
    const timeDiff = (today - investedDate) / (1000 * 3600 * 24);

    // Simplified price change calculation
    const priceChangePercentage = selectedCrypto.price_change_percentage_24h / 24 * timeDiff;
    const estimatedPastPrice = currentPrice / (1 + (priceChangePercentage / 100));

    // Convert investment amount to USD if necessary
    let investedAmountUSD = investedAmount;
    if (investmentCurrency !== 'USD') {
      const conversionRates = { USD: 1, EUR: 0.85, INR: 75, GBP: 0.75 };
      investedAmountUSD = investedAmount / conversionRates[investmentCurrency];
    }

    const coinsPurchased = investedAmountUSD / estimatedPastPrice;
    const estimatedValue = coinsPurchased * currentPrice;

    setCurrentValue(estimatedValue.toFixed(2));

    // Calculate profit/loss percentage
    const profitLossPercentage = ((estimatedValue - investedAmountUSD) / investedAmountUSD) * 100;
    setProfitLoss(profitLossPercentage);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Cryptocurrency Price Chart',
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true
          },
          mode: 'xy',
        },
        pan: {
          enabled: true,
          mode: 'xy',
        },
      },
    },
  };

  const filteredCryptoData = cryptoData
  .filter(crypto => crypto.name.toLowerCase().includes(searchTerm.toLowerCase()))
  .sort((a, b) => sortOrder === 'desc' ? b.current_price - a.current_price : a.current_price - b.current_price);

return (
  <Container
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
      <Header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <Logo
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => router.push('/home')}
        >
          <Image src={logo} alt="Zendesk" width={180} height={55} />
        </Logo>
        <Nav>
          <NavLink 
            onClick={() => router.push('/home')} 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            isActive={pathname === '/home'}
          >
            Home
          </NavLink>
          <NavLink 
            onClick={() => router.push('/wallet')} 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            isActive={pathname === '/wallet'}
          >
            Crypto
          </NavLink>
          <NavLink 
            onClick={() => router.push('/marketplace')} 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            isActive={pathname === '/marketplace'}
          >
            Marketplace
          </NavLink>
          <NavLink 
            onClick={() => router.push('/sepolia')} 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            isActive={pathname === '/sepolia'}
          >
            Sepolia Testnet
          </NavLink>
          <NavLink 
            onClick={() => router.push('/tokens')} 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            isActive={pathname === '/tokens'}
          >
            Tokens
            </NavLink>
          <NavLink 
            onClick={() => router.push('/')} 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </NavLink>
        </Nav>
      </Header>
      <MainContent>
        <PageTitle variants={itemVariants}>Cryptocurrency Market</PageTitle>
        <Card variants={itemVariants}>
          <h2>Price Chart</h2>
          <StyledSelect value={selectedCrypto} onChange={(e) => setSelectedCrypto(e.target.value)}>
            {cryptoData.map(crypto => (
              <option key={crypto.id} value={crypto.id}>{crypto.name}</option>
            ))}
          </StyledSelect>
          <StyledSelect value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)}>
            <option value="1">1 Day</option>
            <option value="7">1 Week</option>
            <option value="30">1 Month</option>
            <option value="180">6 Months</option>
            <option value="365">1 Year</option>
          </StyledSelect>
          <ChartContainer onClick={() => setShowDetailedView(true)}>
            {chartData && chartData.datasets && chartData.datasets.length > 0 ? (
              <Line options={chartOptions} data={chartData} />
            ) : (
              <p>Loading chart data...</p>
            )}
          </ChartContainer>
        </Card>
        <Card variants={itemVariants}>
          <h2>Currency Converter</h2>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <StyledSelect value={convertFrom} onChange={(e) => setConvertFrom(e.target.value)}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
          </StyledSelect>
          <StyledSelect value={convertTo} onChange={(e) => setConvertTo(e.target.value)}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
          </StyledSelect>
          <Button onClick={handleConvert}>Convert</Button>
          {convertedAmount && (
            <p>{amount} {convertFrom} = {convertedAmount.toFixed(6)} {convertTo}</p>
          )}
        </Card>
        <Card variants={itemVariants}>
          <h2>Investment Calculator</h2>
          <Input 
            type="number" 
            placeholder="Investment amount" 
            value={investmentAmount} 
            onChange={(e) => setInvestmentAmount(e.target.value)} 
          />
          <StyledSelect 
            value={investmentCurrency} 
            onChange={(e) => setInvestmentCurrency(e.target.value)}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="INR">INR</option>
            <option value="GBP">GBP</option>
          </StyledSelect>
          <StyledSelect 
            value={investmentCrypto} 
            onChange={(e) => setInvestmentCrypto(e.target.value)}
          >
            {cryptoData.map(crypto => (
              <option key={crypto.id} value={crypto.id}>{crypto.name}</option>
            ))}
          </StyledSelect>
          <StyledDateInput 
            type="date" 
            value={investmentDate} 
            onChange={(e) => setInvestmentDate(e.target.value)} 
            max={new Date().toISOString().split('T')[0]}
          />
          <Button onClick={handleInvestmentCalculation}>Calculate</Button>
          {currentValue && (
            <div>
              <p>Estimated current value: ${currentValue}</p>
              <p>Profit/Loss: {profitLoss > 0 ? '+' : ''}{profitLoss.toFixed(2)}%</p>
            </div>
          )}
        </Card>
        <Card variants={itemVariants}>
          <h2>Top Cryptocurrencies</h2>
          <SearchBar 
            type="text" 
            placeholder="Search cryptocurrencies..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <Button onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}>
            Sort by Price {sortOrder === 'desc' ? '↓' : '↑'}
          </Button>
          <Table>
            <thead>
              <tr>
                <Th>Rank</Th>
                <Th>Name</Th>
                <Th>Symbol</Th>
                <Th>Price (USD)</Th>
                <Th>24h Change</Th>
              </tr>
            </thead>
            <tbody>
              {filteredCryptoData.slice(0, 10).map((crypto) => (
                <tr key={crypto.id}>
                  <Td>{crypto.market_cap_rank}</Td>
                  <Td>{crypto.name}</Td>
                  <Td>{crypto.symbol.toUpperCase()}</Td>
                  <Td>${crypto.current_price.toLocaleString()}</Td>
                  <Td style={{ color: crypto.price_change_percentage_24h >= 0 ? '#4caf50' : '#f44336' }}>
                    {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </MainContent>
      <AnimatePresence>
        {showDetailedView && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetailedView(false)}
          >
            <ModalContent
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2>Detailed Chart View</h2>
              {chartData && chartData.datasets && chartData.datasets.length > 0 && (
                <Line options={chartOptions} data={chartData} />
              )}
              <Button onClick={() => setShowDetailedView(false)}>Close</Button>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </Container>
  );
}