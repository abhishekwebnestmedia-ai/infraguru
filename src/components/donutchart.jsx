 const ApexChart = () => {
        const [state, setState] = React.useState({
          
            series: [44, 55, 41, 17, 15],
            options: {
              chart: {
                type: 'donut',
              },
              responsive: [{
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200
                  },
                  legend: {
                    position: 'bottom'
                  }
                }
              }]
            },
          
          
        });

        

        return (
          <div>
            <div id="chart">
                <ReactApexChart options={state.options} series={state.series} type="donut" />
              </div>
            <div id="html-dist"></div>
          </div>
        );
      }

      const domContainer = document.querySelector('#app');
      ReactDOM.render(<ApexChart />, domContainer);
