import React, {Component} from 'react';
import {Text, View} from 'react-native';
import PropTypes from 'prop-types';
import STYLES from "./Counter.styles";

export default class Counter extends Component {

    counterInterval;

    constructor(props) {
        super(props);
        console.disableYellowBox = true;
        this.state = {
            counter: -1
        };
    }

    startCounter() {
        this.setState({
            counter: this.props.initialValue
        }, () => {
            this.counterInterval = setInterval(() => {
                    if (this.state.counter > 0) {
                        this.setState((state) => {
                            return {
                                counter: state.counter - 1
                            }
                        });
                    } else {
                        clearInterval(this.counterInterval);
                        this.props.onCounterExpired && this.props.onCounterExpired();
                    }
                }, 1000
            );
        });
    }

    componentWillUnmount() {
        clearInterval(this.counterInterval);
    }

    render() {
        return (
            <View style={STYLES.container}>
                {this.state.counter > 0 &&
                <Text style={STYLES.counterText}>{this.state.counter === 0 ? 'Cheese !' : this.state.counter}</Text>
                }
            </View>
        );
    }

}

Counter.propTypes = {
    "initialValue": PropTypes.number.isRequired,
    "onCounterExpired": PropTypes.func
};
