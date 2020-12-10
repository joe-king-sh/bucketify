import React, { useEffect, useState, useContext } from 'react';
// import { AuthState } from '@aws-amplify/ui-components';
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createTodo } from '../../graphql/mutations'
import { listTodos } from '../../graphql/queries'
import { ListTodosQuery, } from '../../API'
import { GraphQLResult } from '@aws-amplify/api/lib/types';

import {
    UserDataContext,
    IUserDataStateHooks,
} from '../../App'

import awsExports from "../../aws-exports";


Amplify.configure(awsExports);

const initialState: Todo = {
    name: '',
    description: '',
    owner: '',
}

type Todo = {
    id?: string;
    name: string;
    description: string | '';
    owner: string | null;
}

type Todos = (Todo)[]


// const styles = {
//     container: { width: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 },
//     todo: { marginBottom: 15 },
//     input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
//     todoName: { fontSize: 20, fontWeight: 'bold' },
//     todoDescription: { marginBottom: 0 },
//     button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
// }



const GraphqlTest: React.FC = () => {

    const UserDataHooks: IUserDataStateHooks = useContext(UserDataContext);

    const [formState, setFormState] = useState(initialState);
    const [todos, setTodos] = useState<Todos>([]);

    useEffect(() => {
        fetchTodos()
    }, [])

    const setInput = (key: string, value: string) => {
        setFormState({ ...formState, [key]: value })
    }

    const fetchTodos = async () => {
        try {
            let todos: Todos = []
            const todoData = await API.graphql(graphqlOperation(listTodos)) as GraphQLResult
            const rawTodos = todoData.data as ListTodosQuery
            if (rawTodos.listTodos != null) {
                if (rawTodos.listTodos.items != null) {
                    console.log(rawTodos.listTodos)
                    rawTodos.listTodos.items.forEach((item) => {
                        if (item != null) {
                            todos.push({
                                id: item.id,
                                name: item.name.replace(item.owner + '-', ""),
                                description: item.description,
                                owner: item.description,
                            })
                        }
                    })
                }
            }
            setTodos(todos);

        } catch (err) { console.log('error fetching todos') }
    }

    const addTodo = async () => {
        try {
            console.log('start addTodo')
            if (!formState.name || !formState.description) return

            formState.name = UserDataHooks.user.username + '-' + formState.name

            console.log(UserDataHooks.user)

            const todo: Todo = { ...formState,
            'owner': UserDataHooks.user.username }

            console.log('The todo item going to put item to dynamodb is below:')
            console.log(todo)
            await API.graphql(graphqlOperation(createTodo, { input: todo }))

            if (todos != null) {
                setTodos([...todos, todo])
            } else {
                setTodos([todo])
            }
            setFormState(initialState)

        } catch (err) {
            console.log('error creating todo:', err)
        }
    }


    return (
        // <GenericTemplate>
            // <LoginRequiredWrapper isLoginRequired={true}>

                <div >
                    <h2>Amplify Todos</h2>
                    <input
                        onChange={event => setInput('name', event.target.value)}
                        value={formState.name}
                        placeholder="Name"
                    />
                    <input
                        onChange={event => setInput('description', event.target.value)}
                        value={formState.description}
                        placeholder="Description"
                    />
                    <button onClick={addTodo}>Create Todo</button>
                    {
                        todos.map((todo, index) => (
                            <div key={todo.id ? todo.id : index} >
                                <p >{todo.name}</p>
                                <p >{todo.description}</p>
                            </div>
                        ))
                    }
                </div>

            // </LoginRequiredWrapper>
        // </GenericTemplate>
    )
}



export default GraphqlTest