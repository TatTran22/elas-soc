import * as React from 'react';
import './product.page.scss';
import Header from '../../components/header/header.component';
import CardList from '../../components/card/cardList.component';
import Footer from './../../components/footer/footer.component';

class ProductPage extends React.Component {
  state = {
    darkTheme: true,
  };

  handleThemeChange = (e) => {
    this.setState({ darkTheme: !this.state.darkTheme });
    console.log(this.state.darkTheme);
  };

  render() {
    return (
      <div
        className={`ui container product-page ${
          this.state.darkTheme ? 'bp3-dark' : ''
        }`}
      >
        <Header
          onThemeChange={this.handleThemeChange}
          darkTheme={this.state.darkTheme}
        />
        <CardList />
        <Footer />
      </div>
    );
  }
}

export default ProductPage;
