import React, { forwardRef, useState, useEffect } from 'react'
import { Input, Select, Form } from 'antd'

const UserForm = forwardRef((props, ref) => {
    const [form] = Form.useForm();
    const [isDisabled, setisDisabled] = useState(false);
    const { roleId, region } = JSON.parse(localStorage.getItem('token'))
    useEffect(() => {
        setisDisabled(props.isUpdateDisabled)
    }, [props.isUpdateDisabled]);
    const handleChange = (value) => {
        if (value === 1) {
            ref.current.setFieldsValue({
                region: ''
            })
            setisDisabled(true)
        }
        else {
            setisDisabled(false)
        }

    }
    const checkRegionDisabled = (item) => {
        if (props.isUpdate) {
            if (roleId === 1) {
                return false
            }
            return true
        }
        else {
            if (roleId === 1) {
                return false
            } else {
                if (item.value === region) {
                    return false
                }
                return true
            }
        }
    }
    const checkRoleDisabled = (item) => {
        if (props.isUpdate) {
            if (roleId === 1) {
                return false
            }
            return true
        }
        else {
            if (roleId === 1) {
                return false
            } else {
                return item.id!==3
                    
            }
        }
    }
    return (
        <Form ref={ref}
            form={form}
            layout="vertical"
            name="form_in_modal"
            initialValues={{
                modifier: 'public',
            }}
        >
            <Form.Item
                name="username"
                label="用户名"
                rules={[
                    {
                        required: true,
                        message: '请输入用户名!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[
                    {
                        required: true,
                        message: '请输入密码!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={isDisabled ? [] : [
                    {
                        required: true,
                        message: '请选择区域!',
                    },
                ]}
            >
                <Select
                    // style={{
                    //   width: 120,
                    // }}
                    disabled={isDisabled}
                    options={props.regionList.map(item => {
                        return {
                            value: item.value,
                            label: item.title,
                            disabled: checkRegionDisabled(item)

                        }
                    })}
                />
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[
                    {
                        required: true,
                        message: '请选择角色!',
                    },
                ]}
            >
                <Select
                    // style={{ 
                    //   width: 120,
                    // }}
                    onChange={handleChange}
                    options={props.roleList.map(item => {
                        return {
                            value: item.id,
                            label: item.roleName,
                            disabled: checkRoleDisabled(item)
                        }
                    })}
                />
            </Form.Item>
        </Form>
    )
})
export default UserForm;
