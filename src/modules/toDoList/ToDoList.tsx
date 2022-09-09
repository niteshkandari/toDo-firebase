import React, { useEffect, useRef, useState } from 'react';
import {
  DeleteFilled,
  EditFilled,
  ExclamationCircleOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { InputRef, message, Tooltip, Button, Input, Space, Table, Form, Typography, Modal } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import ListCreator from '../listCreator';
import { collection, query, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';

interface DataType {
  key: string;
  name: string;
  department: string;
  salary: string;
}

type DataIndex = keyof DataType;

type ToDoListProps = {
  //
};

const ToDoList: React.FC<any> = (props) => {
  const { open, setOpen } = props;
  const [employeeData, setEmployeeData] = useState<DataType[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [searchedColumn, setSearchedColumn] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const searchInput = useRef<InputRef>(null);
  const [employeeForm] = Form.useForm();
  const { confirm } = Modal;
  const { Text } = Typography;

  useEffect(() => {
    const q = query(collection(db, 'toDos'));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let tempArray: DataType[] = [];
      querySnapshot.forEach((doc: any) => {
        tempArray.push({ ...doc.data(), key: doc.id });
      });
      setEmployeeData([...tempArray]);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}>
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}>
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text,record) =>
    { 
      if(dataIndex === 'salary') {
        return <Text keyboard>&#8377; {text}</Text>
      }
      else return searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      )}
  });

  const ActionTemplate = (text: any, record: any) => {
    const showDeleteConfirm = () => {
      confirm({
        title: 'Are you sure you want to delete this task?',
        icon: <ExclamationCircleOutlined />,
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        async onOk() {
          await deleteDoc(doc(db, 'toDos', record.key));
          message.success('Record deleted successfully');
        },
        onCancel() {}
      });
    };

    const handleEditAction = (e: any) => {
      employeeForm.setFieldsValue({
        edit: true,
        key: record.key,
        name: record.name,
        department: record.department,
        salary: record.salary
      });
      setOpen(true);
    };
    const handleDeleteAction = async (e: any) => {
      showDeleteConfirm();
    };

    return (
      <div className="flex justify-center items-center text-2xl space-x-4 text-cyan-500">
        <Tooltip placement="topLeft" title={'edit user data...'}>
          <EditFilled className="cursor-pointer hover:text-cyan-400" onClick={handleEditAction} />
        </Tooltip>
        <Tooltip placement="topLeft" title={'delete user data...'}>
          <DeleteFilled
            className="cursor-pointer hover:text-cyan-400"
            onClick={handleDeleteAction}
          />
        </Tooltip>
      </div>
    );
  };
  
  const columns: ColumnsType<DataType> = [
    {
      title: 'Employee Name',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      ...getColumnSearchProps('name')
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: '30%',
      ...getColumnSearchProps('department')
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      width: '30%',
      ...getColumnSearchProps('salary'),
      sorter: (a, b) => a.salary.length - b.salary.length,
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Action',
      key: 'action',
      render: ActionTemplate,
      width: '15%'
    }
  ];

  return (
    <>
      <Table columns={columns} dataSource={employeeData} pagination={false} loading={isLoading} />
      <ListCreator employeeForm={employeeForm} open={open} setOpen={setOpen} />
    </>
  );
};

export default ToDoList;
