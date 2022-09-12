import React, { useState } from 'react';
import { Layout, Tooltip } from 'antd';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import { PlusSquareOutlined } from '@ant-design/icons';
import ToDoList from '../toDoList/ToDoList';

const Home = () => {
  const [open, setOpen] = useState<boolean>(false);

  const handleShowDrawer = () => {
    setOpen(true)
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{color: 'white', display: 'flex', alignItems: 'center',justifyContent: 'end'}}>
      <span className="mr-20 text-xl underline underline-offset-8">
       employee management system using
        <strong className="text-cyan-500">🔥Base</strong>
      </span>  
      <Tooltip placement="topLeft" title={"create user data..."}>
        <div className="text-white hover:text-slate-300 text-3xl m-2 cursor-pointer">
        <PlusSquareOutlined onClick={handleShowDrawer}/>
        </div>
       </Tooltip> 
      </Header>
      <Layout>
        <Content style={{ height: '100%' }} className="py-5 px-6">
          <ToDoList
          open={open}
          setOpen={setOpen}
          />
        </Content>
      </Layout>
      <Footer
        style={{
          backgroundColor: 'white',
          color: 'grey',
          textAlign: 'center',
          height: '3vh',
        }}>
        @ems 🔥Base
      </Footer>
    </Layout>
  );
};

export default Home;


