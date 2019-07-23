import React from 'react';
import SpriteSheet from 'rn-sprite-sheet';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as yup from 'yup';
import { StyleSheet, SafeAreaView, View, TextInput, Text, Button, Keyboard } from 'react-native'
import { withFormik, ErrorMessage } from 'formik';
import StateMachine from 'javascript-state-machine';

const sprite = require('./assets/cow.png');

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.fsm = new StateMachine({
            init: 'login',
            transitions: [
                { name: 'loginInput', from: 'login', to: 'login' },
                { name: 'loginInputFocus', from: ['login', 'password', 'success', 'failed', 'error'], to: 'login' },
                { name: 'passwordInput', from: ['login', 'password', 'success', 'failed', 'error'], to: 'password' },
                { name: 'showPassword', from: '*', to: () => this.fsm.state },
                { name: 'sendRequest', from: '*', to: 'request' },
                { name: 'successLogin', from: 'request', to: 'success' },
                { name: 'failedLogin', from: 'request', to: 'failed' },
                { name: 'validationError', from: '*', to: 'error' },
            ],
            methods: {
                onLoginInput: () => this.setState({
                    propsAnimation: defaultPropsAnimation,
                    typeAnimation: this.props.values.login.length > 8 ? 8 : this.props.values.login.length
                }),
                onPasswordInput: ({ from }) => from !== 'password' && this.setState({
                    propsAnimation: defaultPropsAnimation,
                    typeAnimation: this.state.showPassword
                        ? 'closeOneEye'
                        : 'closeEyes',
                }),
                onShowPassword: ({ from }) => this.setState({
                    showPassword: !this.state.showPassword,
                    propsAnimation: defaultPropsAnimation,
                    typeAnimation: from === 'password'
                        ? !this.state.showPassword
                            ? 'showPassword'
                            : 'hidePassword'
                        : this.state.typeAnimation,


                }),
                onLoginInputFocus: ({ from }) => from === 'password'
                    ? this.setState({
                        propsAnimation: defaultPropsAnimation,
                        typeAnimation: this.state.showPassword
                            ? 'openOneEye'
                            : 'openEyes',
                    })
                    : this.fsm.onLoginInput(),
                onSendRequest: () => this.setState({
                    typeAnimation: 'sendRequest',
                    propsAnimation: { ...defaultPropsAnimation, loop: true }
                }),
                onFailedLogin: () => this.setState({
                    typeAnimation: 'serverError',
                    propsAnimation: { ...defaultPropsAnimation, loop: true }
                }),
                onSuccessLogin: () => this.setState({
                    propsAnimation: defaultPropsAnimation,
                    typeAnimation: 'serverSuccess',
                }),
                onValidationError: () => this.setState({
                    propsAnimation: defaultPropsAnimation,
                    typeAnimation: 'validationError',
                }),
            },
        });
        this.state = {
            showPassword: false,
            typeAnimation: 'openEyes',
            propsAnimation: defaultPropsAnimation,
        };
        this.refAnimatedImage = React.createRef();
        this.refPasswordField = React.createRef();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.values[fieldName.login] !== this.props.values[fieldName.login]) {
            this.fsm.loginInput();
        }
        if (this.props.isSubmitting) {
            if (prevProps.isValidating && !this.props.isValidating && this.props.isValid) {
                this.fsm.sendRequest();
                Keyboard.dismiss();
            }
        }
        if (prevProps.isSubmitting && !this.props.isSubmitting) {
            if (this.props.isValid) {
                if (this.props.status === 'error') {
                    this.fsm.failedLogin();
                } else {
                    this.fsm.successLogin();
                }
            } else {
                this.fsm.validationError();
                Keyboard.dismiss();
            }
        }
        if (prevState.typeAnimation !== this.state.typeAnimation) {
            this.refAnimatedImage.current.play({
                type: this.state.typeAnimation,
                ...this.state.propsAnimation,
            });
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.section}>
                <View style={styles.imageWrap}>
                    <SpriteSheet
                        ref={this.refAnimatedImage}
                        source={sprite}
                        columns={9}
                        rows={4}
                        width={180}
                        imageStyle={styles.imageStyle}
                        animations={animation}
                    />
                </View>
                <View style={styles.section}>
                    <View style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}>
                        <TextInput
                            autoFocus
                            style={{ borderWidth: 1 }}
                            onFocus={() => this.fsm.loginInputFocus()}
                            onChangeText={this.props.handleChange(fieldName.login)}
                            onBlur={this.props.handleBlur(fieldName.login)}
                            value={this.props.values[fieldName.login]}
                        />
                        <ErrorMessage
                            name={fieldName.login}
                            render={msg => (<Text style={{ color: 'red' }}>{msg}</Text>)}
                        />
                        <View>
                            <TextInput
                                ref={this.refPasswordField}
                                secureTextEntry={!this.state.showPassword}
                                style={{ borderWidth: 1, marginTop: 20 }}
                                onChangeText={this.props.handleChange(fieldName.password)}
                                onBlur={this.handleBlurPassword}
                                onFocus={() => this.fsm.passwordInput()}
                                value={this.props.values[fieldName.password]}
                            />
                            <Icon name={this.state.showPassword ? 'eye-slash' : 'eye'} size={30}
                                  style={{ position: 'absolute', top: 30, right: 10 }}
                                  onPress={() => this.fsm.showPassword()}/>
                            <ErrorMessage
                                name={fieldName.password}
                                render={msg => (<Text style={{ color: 'red' }}>{msg}</Text>)}
                            />
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Button title="Log in" onPress={this.props.handleSubmit}/>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    section: { flex: 1 },
    imageWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyle: { marginTop: -1 },
});

const fieldName = {
    login: 'login',
    password: 'password',
};

const loginSchema = yup.object().shape({
    [fieldName.login]: yup.string().required(),
    [fieldName.password]: yup.string().required().min(6),
});

const defaultPropsAnimation = {
    loop: false,
    resetAfterFinish: false,
    fps: 10,
};

const MainAnimationLength = 9;
const MainAnimation = Array.from({ length: MainAnimationLength }).reduce((acc, val, i) => ({ ...acc, [i]: [i] }), {});
const animation = {
    ...MainAnimation,
    closeOneEye: Array.from({ length: 4 }, (v, i) => i + 8),
    closeEyes: Array.from({ length: 5 }, (v, i) => i + 8),
    showPassword: [11],
    hidePassword: [12],
    openEyes: Array.from({ length: 5 }, (v, i) => 12 - i),
    openOneEye: Array.from({ length: 4 }, (v, i) => 11 - i),
    sendRequest: Array.from({ length: 9 }, (v, i) => i + 27),
    validationError: Array.from({ length: 3 }, (v, i) => i + 18),
    serverSuccess: Array.from({ length: 4 }, (v, i) => i + 13),
    serverError: Array.from({ length: 3 }, (v, i) => i + 21),
};


export default withFormik({
    validationSchema: loginSchema,
    validateOnChange: false,
    validateOnBlur: false,
    mapPropsToValues: () => ({
        [fieldName.login]: '',
        [fieldName.password]: '',
    }),
    handleSubmit: (values, formikBag) => {
        setTimeout(() => {
            if (values[fieldName.login] === 'login') {
                formikBag.setStatus('success');
            } else {
                formikBag.setStatus('error');
            }
            formikBag.setSubmitting(false);
        }, 3000)
    }
})(Index);
