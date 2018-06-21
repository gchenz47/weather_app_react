import React from "react";
import Titles from "./components/Titles";
import Form from "./components/Form";
import Weather from "./components/Weather";

const API_KEY = "a9db68249f57e0b484f581f1319d9ad2";
class App extends React.Component{
  state = {
    temperature: undefined,
    humidity: undefined,
    description: undefined,
    city: undefined,
    country: undefined,
    error: undefined
  }
  getWeather = async (e) =>{
    e.preventDefault();
    const city = e.target.elements.City.value;
    const country = e.target.elements.Country.value;
    const api_call = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${
      city},${country}&appid=${API_KEY}`);
    const data = await api_call.json();
    if(city && country){
      if(data.cod !== '404'){
        this.setState({
          temperature: data.main.temp,
          humidity: data.main.humidity,
          description: data.weather[0].description,
          city: data.name,
          country: data.sys.country
        })
      }else{
        this.setState({
          temperature: undefined,
          humidity: undefined,
          description: undefined,
          city: undefined,
          country: undefined,
          error: 'Something is wrong with the city or country name...'
        })
      }
    }else{
      this.setState({
        temperature: undefined,
        humidity: undefined,
        description: undefined,
        city: undefined,
        country: undefined,
        error: 'Please enter city and country'
      })
    }
  }

  render(){
    return(
      <div>
        <div>
          <div className="wrapper">
            <div className="main">
              <div className="container">
                <div className="row">
                  <div className="col-xs-5 title-container">
                    <Titles />
                  </div>
                  <div className="col-xs-7 form-container">
                    <Form getWeather={this.getWeather} />
                    <Weather
                      temperature={this.state.temperature}
                      humidity={this.state.humidity}
                      city={this.state.city}
                      country={this.state.country}
                      description={this.state.description}
                      error={this.state.error}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default App;
