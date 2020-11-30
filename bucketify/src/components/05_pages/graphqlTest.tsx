import React, { useEffect, useState } from 'react';
import { AuthState } from '@aws-amplify/ui-components';
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createTodo } from '../../graphql/mutations'
import { listTodos } from '../../graphql/queries'

import awsExports from "../../aws-exports";
Amplify.configure(awsExports);

// Template
import LoginRequiredWrapper from '../04_templates/loginRequiredWrapper';
import GenericTemplate from '../04_templates/genericTemplate';

const initialState = { name: '', description: '' }

const GraphqlTest: React.FC = () => {

    // const UserDataHooks: IUserDataStateHooks = useContext(UserDataContext);

    const [formState, setFormState] = useState(initialState)
    const [todos, setTodos] = useState([])

    useEffect(() => {
        fetchTodos()
      }, [])
    
    const setInput = (key:string, value:string) => {
        setFormState({ ...formState, [key]: value })
      }
    
    async function fetchTodos() {
    try {
        const todoData = await API.graphql(graphqlOperation(listTodos))
        const todos = todoData.data.listTodos.items
        setTodos(todos)
    } catch (err) { console.log('error fetching todos') }
    }
    
    async function addTodo() {
    try {
        if (!formState.name || !formState.description) return
        const todo = { ...formState }
        setTodos([...todos, todo])
        setFormState(initialState)
        await API.graphql(graphqlOperation(createTodo, {input: todo}))
    } catch (err) {
        console.log('error creating todo:', err)
    }
    }

    return (
        <GenericTemplate>
            <LoginRequiredWrapper isLoginRequired={true}>

            </LoginRequiredWrapper>
        </GenericTemplate>
    )
}
export default GraphqlTest