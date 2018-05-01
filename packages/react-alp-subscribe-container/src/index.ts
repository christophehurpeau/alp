import { ComponentClass } from 'react';
import { connect } from 'react-redux';
import SubscribeContainer, { OwnProps } from './SubscribeContainer';

const SubscribeContainerConnected: ComponentClass<OwnProps> = connect()(SubscribeContainer);

export default SubscribeContainerConnected;
