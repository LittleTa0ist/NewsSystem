import React, { useState, useRef, useContext } from 'react';
import { Table, Modal, Button, Form, Input } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons';
import axios from 'axios'
import { useEffect } from 'react';
import { Fragment } from 'react';
// import {  useNavigate } from 'react-router-dom';
const NewsCategory = () => {
  const [form] = Form.useForm();
  const [dataSource, setSource] = useState([])
  const [open, setOpen] = useState(false)
  // const navigate = useNavigate()
  const newsFormRef = useRef(null)
  const { confirm } = Modal;
  const EditableContext = React.createContext(null);
  useEffect(() => {
    axios.get(`http://localhost:5000/categories`).then(res => {
      setSource(res.data)
    })
  }, [])
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
  };
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: "title",
        title: '栏目名称',
        handleSave: handleSave,
      }),
    },
    {
      title: '操作',
      // 不设置dataIndex的情况下，render中传入的参数item便是当前这一项
      render: (item) => {
        return <span style={{ color: 'red', cursor: 'pointer' }} onClick={() => { confirmMethod(item) }}>删除</span>
      }
    }
  ]
  const handleSave = record => {
    setSource(dataSource.map(item => {
      return item.id === record.id ? {
        id:item.id ,
        title: record.title,
        value: record.value
      } : item
    }))
    axios.patch(`http://127.0.0.1:5000/categories/${record.id}`, {
      title: record.title,
      value: record.value
    })
  }
  const confirmMethod = (item) => {
    confirm({
      title: 'Do you Want to delete these items?',
      icon: <ExclamationCircleFilled />,
      content: '确定要删除吗？',
      okText: '是的',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        deleteMethod(item)
      },
      onCancel() {

      }
    });
  }
  const deleteMethod = (item) => {

    setSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`http://localhost:5000/categories/${item.id}`)
  }
  const addCategory = () => {
    setOpen(false)

    newsFormRef.current.validateFields().then(res => {
      newsFormRef.current.resetFields()
      axios.post('http://localhost:5000/categories', {
        "title": res.title,
        "value": res.title
      }).then(res => {
        setSource([...dataSource, {
          ...res.data
        }])
      })

    })
      .catch(err => {
        console.log(err);
      });
  }
  return (
    <Fragment>
      <Button style={{ marginBottom: '20px' }} type='primary' onClick={() => setOpen(true)}>添加类型</Button>
      <Table components={
        {
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }
      }
        dataSource={dataSource} columns={columns} rowKey={item => item.id}></Table>
      <Modal
        open={open}
        title="添加类型"
        okText="确定"
        cancelText="取消"
        onCancel={() => setOpen(false)}
        onOk={addCategory}
      >
        <Form ref={newsFormRef}
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: 'public',
          }}
        >
          <Form.Item
            name="title"
            label="新闻类型"
            rules={[
              {
                required: true,
                message: '请输入新闻类型!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>

  );
}

export default NewsCategory;
