import React from "react";
import { Button, Dropdown, Menu, Space } from 'antd';
import "antd/es/style/reset.css";
import './App.css';
import {Link} from 'react-router-dom';

const menu = (
  <Menu
    items={[
      {
        key: '1',
        label: (
          <div><Link to="/Bisection">Bisection</Link></div>
        ),
      },
      {
        key: '2',
        label: (
          <div><Link to="/FalsePosition">False Position Method</Link></div>
        ),
      },
      {
        key: '3',
        label: (
          <div><Link to="/OnePointIteration">One Point Method</Link></div>
        ),
      },
      {
          key: '4',
          label: (
              <div><Link to="/NewtonRaphson">Newton Raphson Method</Link></div>
          ),
      },
    ]}
  />
);

function Navbar(){
    
      
  return (
      <>
      <header className="Navbar">Numerical Method 
      &nbsp;
      <Space direction="vertical">
          <Space wrap>
              <Button ghost>
                  <Link to="/">HOME</Link>
              </Button>
              <Dropdown overlay={menu} placement="bottomLeft">
                  <Button ghost>ROOT OF EQUATIONS</Button>
              </Dropdown>
          </Space> 
      </Space>     
      </header>
      
      
      </>
      )
  }
  export default Navbar