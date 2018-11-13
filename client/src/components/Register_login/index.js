import React from 'react';
import AllButtons from '../utils/buttons';

const RegisterLogin = () => {
    return (
        <div className="page_wrapper">
            <div className="container">
                <div className="register_login_container">
                    <div className="left">
                        <h1>New Customers</h1>
                        <p>Integer libero nisi, molestie nec venenatis sit amet, commodo nec neque. Etiam eu tincidunt libero. Nunc ex nisi, facilisis ut massa vitae, condimentum ullamcorper justo. Cras nibh nulla, cursus eu mollis finibus, molestie ac mauris. Aliquam non urna pellentesque, pulvinar mi eu, sodales mauris.</p>
                        <AllButtons type="default" title="Create an account" linkTo="/register" addStyles={{ margin: '10px 0 0 0 ' }} />
                    </div>
                    <div className="right">

                    </div>

                </div>
            </div>

        </div>
    );
};

export default RegisterLogin;