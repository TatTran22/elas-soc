import * as React from 'react';
import './HomePage.scss';
import Header from '../../components/header/header.component';
import CardList from '../../components/card/cardList.component';
import Footer from './../../components/footer/footer.component';
class HomePage extends React.Component {
  state = {
    darkTheme: true,
  };

  handleThemeChange = (e) => {
    this.setState({ darkTheme: !this.state.darkTheme });
    console.log(this.state.darkTheme);
  };

  render() {
    const { darkTheme } = this.state;
    return (
      <div>
        <div className={`ui container ${darkTheme ? 'bp3-dark' : ''}`}>
          <Header
            onThemeChange={this.handleThemeChange}
            darkTheme={darkTheme}
          />
          <Footer />
        </div>
      </div>
    );
  }
}

export default HomePage;
