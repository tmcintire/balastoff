import * as React from "react";
import { Link } from "react-router";
import { Column, Table, AutoSizer } from "react-virtualized";
import * as moment from 'moment';
import * as api from "../../../data/api";
// This only needs to be done once; probably during your application's bootstrapping process.

import { VoidTransaction } from './VoidTransaction';
import { AddMoneyLog } from './AddMoneyLog';
import { IMoneyLogEntry, IConfig, IRegistration } from "../../../data/interfaces";

interface MoneyLogProps {
  log: IMoneyLogEntry[],
  config: IConfig,
  totalCollected: number,
  registrations: IRegistration[]
}

interface MoneyLogState {
  showMoneyLog: boolean,
  showVoidConfirmation: boolean,
  transactionToVoid: IMoneyLogEntry,
}

export class MoneyLog extends React.Component<MoneyLogProps, MoneyLogState> {
  constructor(props) {
    super(props);

    this.state = {
      showMoneyLog: false,
      showVoidConfirmation: false,
      transactionToVoid: null,
    };
  }

  showMoneyLog = () => {
    this.setState({
      showMoneyLog: !this.state.showMoneyLog,
    });
  }

  closePopup = () => {
    this.setState({
      showVoidConfirmation: false,
    });
  }

  toggleVoid = (transactionId) => {
    this.setState({
      showVoidConfirmation: true,
      transactionToVoid: this.props.log[transactionId],
    });
  }

  getRow = ({ index }) => {
    return this.props.log[Object.keys(this.props.log)[index]];
  }

  rowClassName({ index }) {
    if (index < 0) {
      return 'header-row';
    } else {
      return index % 2 === 0 ? 'even-row' : 'odd-row'
    }
  }

  renderDetails = ({ rowData, rowIndex }) => {
    return (
      <div className="flex-col">
        {
          rowData.details && rowData.details.map(d => {
            return (
              <span className="ellipsis">({d.quantity}) {d.item} @ ${d.price.toFixed(2)}/ea</span>
            );
          })
        }
      </div>
    );
  };

  renderAmount = ({ rowData }) => {
    return <span>${rowData.amount.toFixed(2)}</span>;
  }

  renderStatus = ({ rowData }) => {
    if (rowData.void) {
      return <span className="voided">Voided by {rowData.initials}</span>;
    }
    return null;
  }

  getRowHeight = ({ index }) => {
    const log = this.props.log[Object.keys(this.props.log)[index]];
    if (log.details && log.details.length > 1) {
      const datum = log.details.length;
      return datum * 30;
    }
    return 40;
  }

  renderVoid = ({ rowIndex, rowData }) => {
    const transactionId = Object.keys(this.props.log)[rowIndex];
    return <i className="col-xs-1 fa fa-times-circle" onClick={() => this.toggleVoid(transactionId)} />;
  }

  renderBookingId = ({ rowData }) => {
    return <Link to={`editregistration/${rowData.bookingId}`}>{rowData.bookingId}</Link>;
  }

  renderDate = ({ rowData }) => {
    if (rowData.date) {
      const date = moment(rowData.date).format('L, h:mm:ss a');
      return <span>{date}</span>;
    }
    return null;
  }

  render() {
    const renderVoidTransaction = () => {
      if (this.state.showVoidConfirmation) {
        return (
          <VoidTransaction closePopup={this.closePopup} transaction={this.state.transactionToVoid} pw={this.props.config.voidPassword} />
        );
      }
      return null;
    };

    const renderLogTable = () => {
      if (this.props.log) {
        return (
          <AutoSizer>
            {({ height, width }) => (
              <Table
                width={width}
                height={height}
                headerHeight={35}
                rowHeight={this.getRowHeight}
                rowCount={Object.keys(this.props.log).length}
                rowGetter={this.getRow}
                rowClassName={this.rowClassName}
              >
                <Column
                  width={50}
                  label="ID"
                  dataKey="bookingId"
                  cellRenderer={this.renderBookingId}
                />
                <Column
                  width={250}
                  label="Date"
                  dataKey="date"
                  cellRenderer={this.renderDate}
                />
                <Column
                  label="Details"
                  dataKey="details"
                  width={300}
                  cellRenderer={this.renderDetails}
                />
                <Column
                  label="Amount"
                  dataKey="amount"
                  width={100}
                  cellRenderer={this.renderAmount}
                />
                <Column
                  label="Status"
                  dataKey="void"
                  width={150}
                  cellRenderer={this.renderStatus}
                />
                <Column
                  label="Void"
                  dataKey="void"
                  width={50}
                  cellRenderer={this.renderVoid}
                />
              </Table>
            )}
          </AutoSizer>
        );
      }
      return null;
    };

    return (
      <div className="container">
        <span className="show-money-log" onClick={() => this.showMoneyLog()}>Log Money</span>
        <h1 className="text-center">Money Log</h1>
        <div style={{ height: '600px' }}>
          {renderLogTable()}
        </div>
        <h2>Total Collected: ${this.props.totalCollected}</h2>
        {this.state.showMoneyLog && <AddMoneyLog showMoneyLog={this.showMoneyLog} registrations={this.props.registrations} />}
        {renderVoidTransaction()}
      </div>
    );
  }
}