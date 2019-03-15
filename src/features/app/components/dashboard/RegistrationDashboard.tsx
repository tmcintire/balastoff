import * as React from 'react';
import axios from 'axios';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

import * as _ from 'lodash';
import { PureComponent } from 'react';
import { IRegistration, Registration } from '../../../data/interfaces';

import { connect } from 'react-redux';

const Loading = require('react-loading-animation');

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, index,
}) => {
   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

interface RegistrationDashboardProps {
  registrations: IRegistration[],
  config: any
}

interface RegistrationDashboardState {
  registrations: IRegistration[],
  filteredRegistrations: IRegistration[],
  key: string,
  selectedOption: string,
  options: string[],
  data: any,
  headers: any,
  processing: boolean,
  filterText: string,
  processInterval: number,
  timerStarted: boolean,
  err: any,
  paid: number,
  scholarship: number
}

export class RegistrationDashboard extends PureComponent<RegistrationDashboardProps, RegistrationDashboardState> {
  constructor(props) {
    super(props);

    this.state = {
      registrations: [],
      filteredRegistrations: [],
      key: 'value',
      selectedOption: 'City',
      options: ['City', 'US State', 'Country', 'LeadFollow', 'Level', 'TShirts'],
      data: [],
      headers: [],
      processing: false,
      filterText: '',
      processInterval: 5000,
      timerStarted: false,
      err: null,
      paid: 0,
      scholarship: 0
    }
  }

  public interval;

  setRegistrations = () => {
    let registrations = [];
    let headers;
    let rawData;
    axios({
      method: 'get',
      url: 'https://cors-anywhere.herokuapp.com/http://balastoff.dancecamps.org/api.php?token=990a673570ef&format=json&report=Dashboard',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    }).then((response) => {
      headers = response.data.header;
      rawData = response.data.data;

      var regData = [];

      const object = {};
      _.forEach(rawData, (data) => {
        let registration = new Registration();
        _.forEach(headers, (header, headerIndex) => {
          if (header === "Paid" || header === "ScholarshipDonation__price") {
            registration[header] = parseFloat(data[headerIndex]);
          } else {
            registration[header] = data[headerIndex]; 
          }
        });

        registrations.unshift(registration);
      });

      // Count number of registrations unique for this selection
      let tempData = _.countBy(registrations, this.state.selectedOption);
      let data = [];
      _.forEach(tempData, (d, index) => {
        if (index) { // no empty data
          if (this.state.selectedOption === 'TShirts') {
            // we need to add the additional tshirts here so we can display them all at once
            var additional = _.countBy(registrations, 'AdditionalTShirts');
            var newCount = additional[index] ? additional[index] + d : d;

            data.push({name: index, [this.state.selectedOption]: newCount});
          } else {
            data.push({name: index, [this.state.selectedOption]: d});
          }
        }
      });


      this.setState({
        filteredRegistrations: registrations,
        registrations,
        paid: _.sumBy(registrations, 'Paid'),
        scholarship: _.sumBy(registrations, 'ScholarshipDonation__price'),
        data
      })
    }).catch(err => {
      this.setState({
        err
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.config && this.props.config.interval && !this.state.timerStarted) {
      this.setState({
        timerStarted: true,
      }, () => {
        this.interval = setInterval(() => {
          if (!this.state.filterText && this.state.processing) {
            this.setRegistrations();
          }
        }, this.state.processInterval);
      });
    }
  }

  handleValueChange = (e) => {
    e.preventDefault();
    const target = e.target.value;
    const { registrations } = this.state;

    const filteredRegistrations = registrations.filter(reg => {
      if (reg) {
        return (
          _.includes(reg.FirstName.toLowerCase(), target.toLowerCase()) ||
          _.includes(reg.LastName.toLowerCase(), target.toLowerCase()) ||
          _.includes(reg.Level.toLowerCase(), target.toLowerCase()) ||
          _.includes(reg.City.toLowerCase(), target.toLowerCase()) ||
          _.includes(reg['US State'].toLowerCase(), target.toLowerCase()) ||
          _.includes(reg.LeadFollow.toLowerCase(), target.toLowerCase()) ||
          _.includes(reg.Country.toLowerCase(), target.toLowerCase())
        );
      }
    });

    this.setState({
      filteredRegistrations,
      filterText: target,
    });
  }

  handleSelectChange = (e) => {
    this.setState({
      selectedOption: e.target.value
    }, () => {
      this.setRegistrations();
    });
  }

  handleIntervalChange = (e) => {
    const newInterval = parseInt(e.target.value, 10);
    this.setState({
      processInterval: newInterval
    }, () => {
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        if (!this.state.filterText && this.state.processing) {
          console.log('Processing Registrations at interval', newInterval);
          this.setRegistrations();
        }
      }, newInterval);
    });
  }

  render() {
    const { registrations, filteredRegistrations } = this.state;
    return (
      <div className="container form-container">
      {
        this.state.err 
        &&
        <div className="error-container">
          <h3>Too Many Requests</h3>
        </div>
      }
      
      <div className="flex-row flex-justify-space-between">
        <div className="form-group">
          <label htmlFor="interval">Polling Interval:</label>
          <input className="form-control" max-type="number" value={this.state.processInterval} onChange={(e) => this.handleIntervalChange(e)} />
        </div>
        <div className="form-group">
          <label htmlFor="processing">Processing:</label>
          <button className={`form-control btn btn-lg ${this.state.processing ? 'btn-success' : 'btn-danger'}`} onClick={() => this.setState({processing: !this.state.processing})}>{this.state.processing ? 'On' : 'Off'}</button>
        </div>
        <div className="form-group">
          <label htmlFor="filter">Category:</label>
          <select className="form-control" onChange={(e) => this.handleSelectChange(e)}>
            {
              this.state.options.map(o => {
                return (
                  <option value={o}>{o}</option>
                )
              })
            }
          </select>
        </div>
        <div className="flex-col">
          <label htmlFor="filter">Total Registrations:</label>
          <span className="total-registrations">{this.state.registrations && this.state.registrations.length}</span>
        </div>
        <div className="flex-col">
          <label htmlFor="filter">Paid:</label>
          <span className="total-registrations">${this.state.paid}</span>
        </div>
        <div className="flex-col">
          <label htmlFor="filter">Scholarship Donations:</label>
          <span className="total-registrations">${this.state.scholarship}</span>
        </div>
      </div>
        <div>
            {
              registrations
              &&
              <div>
                <BarChart
                  width={1200}
                  height={400}
                  data={this.state.data}
                  margin={{
                    top: 5, right: 30, left: -50, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis allowDecimals={false} dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={this.state.selectedOption} fill="#8884d8" />
                </BarChart>
                </div>
            }
        </div>
        <div>
          <label htmlFor="search">Search Registrations</label>
          <input className="search search-input" id="search" type="text" onChange={this.handleValueChange} />
        </div>
        <div className="table-container">
          <table className="table table-striped table-condensed">
            <thead>
              <th>Name</th>
              <th>Level</th>
              <th>City</th>
              <th>State</th>
              <th>Country</th>
            </thead>
            <tbody>
            {
              filteredRegistrations
              &&
              filteredRegistrations.map(r => {
              return (
                <tr>
                  <td>{r.FirstName} {r.LastName}</td>
                  <td>{r.Level}</td>
                  <td>{r.City}</td>
                  <td>{r['US State']}</td>
                  <td>{r.Country}</td>
                </tr>
              );
            })
            }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  registrations: state.data.registrations.registrations,
  store: state.data.store.store,
  comps: state.data.comps.comps,
  totalCollected: state.data.totalCollected.totalCollected,
  loading: state.data.registrations.loading,
});

export const RegistrationDashboardContainer = connect(mapStateToProps)(RegistrationDashboard);
