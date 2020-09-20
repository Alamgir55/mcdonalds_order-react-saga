import React, {Component} from 'react';

import Model from '../../components/UI/Modal/Modal';
import Aux from '../Ax/Ax';

const withErrorHandler = (WrapperComponent, axios) => {
    return class extends Component {
        state = {
            error: null
        }

        componentDidMount(){
            
            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState({error: null});
                return req;
            });
            this.resInterceptor = axios.interceptors.response.use(res => res, error => {
                this.setState({error: error});
            });
        }

        // componentWillUnmount(){
        //         console.log('Will Unmount', this.reqInterceptor, this.resInterceptor);
        //     axios.interceptors.request.eject(this.reqInterceptor);
        //     axios.interceptors.response.eject(this.resInterceptor);
        // }

        errorConfirmedHandler = () => {
            this.setState({error: null});
        };

        render(){
            return (
                <Aux>
                    <Model show={this.state.error} modalClosed={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error.message : null}
                    </Model>    
                    <WrapperComponent {...this.props} />
                </Aux>
            )
        }
    }
};

export default withErrorHandler;