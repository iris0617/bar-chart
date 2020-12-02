import React, { useState, useRef, useEffect } from 'react';
import { select, axisBottom, axisRight, scaleLinear, scaleBand } from 'd3';
import './App.css';


const App = () => {
  const defaultSeedValue = 5;
  const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 
  'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  const svgRef = useRef(null);
  const [seedValue, setSeedValue] = useState(defaultSeedValue);
  const [barXYValue, setBarXYValue] = useState([]);
  
  
  const handleNumberChange = e => {
    const numberEntered = e.target.value ? e.target.value : defaultSeedValue ;
    setSeedValue(numberEntered);
  }

  useEffect(() => {
    const barXY = alphabet.map(xValue => {
      // generating random value between (-10~90) with (Math.random()*100-10) and adding seed value to it
      const yValue = Math.random()*100-10+seedValue;
      return [xValue, yValue];
    });
    setBarXYValue(barXY);
  }, [seedValue]);

  useEffect(() => {
    const svg = select(svgRef.current);
    const xScale = scaleBand()
                  .domain(alphabet)
                  .range([0, 520])
                  .padding(0.5);
    const yScale = scaleLinear()
                  .domain([-10, 90])
                  .range([180, -20]);

    const xAxis = axisBottom(xScale).ticks(alphabet.length).tickSize(0);
    svg.select(".x-axis").style("transform", "translateY(160px)").call(xAxis);

    const yAxis = axisRight(yScale);
    svg.select(".y-axis").style("transform", "translateX(520px)").call(yAxis);

       svg
       .selectAll(".bar")
       .data(barXYValue)
       .join("rect")
       .attr("class", "bar")
       .style("transform", "scale(1, -1)")
       .attr("x", (value, index) => xScale(value[0]))
       .attr("y", (value, index) => {
         if(value >=0) return yScale(value[1]);
         return Math.abs(yScale(value[1]))
        })
       .attr("y", -160)
       .attr("width", xScale.bandwidth())
       .transition()
       .attr("fill", "blue")
       .attr("height", (value, index) => Math.abs(yScale(value[1])));
  }, [barXYValue]);

  return (
   <React.Fragment>
     <svg className="bar-chart" ref={svgRef}>
       <g className="x-axis"></g>
       <g className="y-axis"></g>
     </svg>
     <br />
     <input type="text" inputMode="numeric" onChange={handleNumberChange} placeholder="Please pick from 1-10 : )" defaultValue={defaultSeedValue} />
   </React.Fragment>
  );
}

export default App;
