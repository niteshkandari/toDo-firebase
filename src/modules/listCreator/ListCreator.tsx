import React, { useState } from 'react';
import { Button, Col, Drawer, Form, Input, message, Row, Select, Space } from 'antd';
import { db } from '../../firebase';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { MoneyCollectOutlined } from '@ant-design/icons';
import { Validator } from "../../util/validator";

type ListCreatorProps = {
  //
};
const { Option } = Select;

message.config({
  top: 40,
})

const ListCreator: React.FC<any> = (props) => {
  const { open, setOpen, employeeForm } = props;
  

  const reset = () => {
    employeeForm.setFieldsValue({
      name: '',
      department: '',
      salary: '',
      edit:false
    });    
  }
  const onClose = () => {
    reset();
    setOpen(false);
  };
  const handleSubmit = async (values: any) => {
   const res:any = Validator.validate(values);
   console.log(res)
   if(!res.isValid) {
    message.error(res.message);
    return;
   }
    if (employeeForm.getFieldValue().edit) {
      await updateDoc(doc(db, 'toDos', employeeForm.getFieldValue().key), {
        ...values
      });
      onClose();
      return;
    }
    await addDoc(collection(db, 'toDos'), {
      ...values
    });
    onClose();
  };

  return (
    <Drawer
      title="Create a new Employee data"
      width={520}
      onClose={onClose}
      open={open}
      bodyStyle={{ paddingBottom: 80 }}>
      <Form form={employeeForm} layout="vertical" hideRequiredMark onFinish={handleSubmit}>
        <Col span={18}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter user name' }]}>
            <Input placeholder="Please enter employee name" />
          </Form.Item>
        </Col>
        <Col span={18}>
          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true, message: 'Please select your Department' }]}>
            <Select placeholder="Please select">
              <Option value="FrontEnd">FrontEnd</Option>
              <Option value="BackEnd">BackEnd</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={18}>
          <Form.Item
            name="salary"
            label="Salary"
            rules={[{ required: true, message: 'Please enter employee salary' }]}>
            <Input prefix={<MoneyCollectOutlined />} placeholder="Please enter employee salary" />
          </Form.Item>
        </Col>

        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Space>
      </Form>
    </Drawer>
  );
};

export default ListCreator;
