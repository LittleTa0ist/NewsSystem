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
      title: '????????????',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: "title",
        title: '????????????',
        handleSave: handleSave,
      }),
    },
    {
      title: '??????',
      // ?????????dataIndex???????????????render??????????????????item?????????????????????
      render: (item) => {
        return <span style={{ color: 'red', cursor: 'pointer' }} onClick={() => { confirmMethod(item) }}>??????</span>
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
      content: '?????????????????????',
      okText: '??????',
      okType: 'danger',
      cancelText: '??????',
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
      <Button style={{ marginBottom: '20px' }} type='primary' onClick={() => setOpen(true)}>????????????</Button>
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
        title="????????????"
        okText="??????"
        cancelText="??????"
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
            label="????????????"
            rules={[
              {
                required: true,
                message: '?????????????????????!',
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
