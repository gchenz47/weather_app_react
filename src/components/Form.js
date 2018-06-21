import React from "react";

const Form = props =>(
    <form onSubmit={props.getWeather}>
      <input type="text" name="City" placeholder="City name...  "/>
      <input type="text" name="Country" placeholder="Country name...  "/>
      <button>Get Weather</button>
    </form>
  );

export default Form;
