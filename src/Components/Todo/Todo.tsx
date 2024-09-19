import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { KeyboardEvent, useEffect, useState } from "react";

import dots from "../../assets/images/dots-horizontal.svg";
import toggle from "../../assets/images/toggle.svg";
import sort from "../../assets/images/sort.svg";
import groupLeft from "../../assets/images/group-left.svg";
import star from "../../assets/images/sidebar-body/star.svg";
import starFilled from "../../assets/images/star-filled.svg";
import listIcon from "../../assets/images/list.svg";
import expandIcon from "../../assets/images/expand.svg";
import rightArrow from "../../assets/images/right.svg";
import checkbox from "../../assets/images/checkbox.svg";
import checkboxTick from "../../assets/images/checkbox-tick.svg";

import { Button } from "../Button/Button";
import { TodoEditor } from "../TodoEditor/TodoEditor";
import { layouts, addTodoOptions } from "../../constants.ts";
import {
  addNewTodo,
  toggleIscompleted,
  toggleIsImportant,
} from "../../store/todoSlice";

import "./todo.scss";
import { Data } from "../../Types/types.ts";
import { RootState } from "../../store/store.ts";
import { Option } from "./Option.tsx";

/**
 * @name Todo
 * @param {{handleClick:Function,sidebar:boolean,menuToggle:boolean}} props
 */
type Props = {
  handleClick: () => void;
  sidebar: boolean;
};
export const Todo = (props: Props) => {
  const dispatch = useDispatch();
  const locationHandle = useLocation();

  let location: string | string[] = locationHandle.pathname.split(":");
  location = location[location.length - 1].replaceAll("%20", " ");

  const [id, setId] = useState(location || "0");
  useEffect(() => {
    setId(location);
  }, [location]);
  /**
   * @name check
   * @type {[{
   * name: string,
   * todos:[
   * {id: number
   * ,sectionId: string
   * ,title: string
   * ,isCompleted: boolean
   * ,isImportant: boolean
   * ,due: date,
   *  subtasks: [{id: number
   * ,sectionId: string
   * ,todoId: number
   * ,subtaskTitle: string,
   * isCompleted: boolean
   * }]
   * }]}]
   * }
   */
  const check: Data[] = useSelector(
    (state: RootState) => state.todoListSection
  );
  // const [dueDate, setDueDate] = useState("");
  // const editDueDate = (id: number, sectionId: string) => {
  //   // const due = new Date(dueDate)
  //   const due = dueDate;
  //   dispatch(changeDueDate({ id, sectionId, due }));
  //   setDueDate("");
  // };
  const [currentTodoListState, setCurrentTodoListState] = useState(check);
  const [menuToggle, setMenuToggle] = useState(false);
  const [activeLayout, setActiveLayout] = useState("grid");
  const [todo, setTodo] = useState("");
  const [focus, setFocus] = useState(false);
  const [expandCompleted, setExpandCompleted] = useState(false);

  useEffect(() => {
    setCurrentTodoListState(check);
  }, [id, check, menuToggle]);
  const [data, setData] = useState(currentTodoListState[parseInt(id)]);
  useEffect(() => {
    setMenuToggle(false);
  }, [id]);
  useEffect(() => {
    setData(currentTodoListState[parseInt(id)]);
  }, [id, currentTodoListState]);

  useEffect(() => {
    setCompletedTodos(data?.todos?.filter((todo) => todo.isCompleted == true));
    setIncompleteTodos(
      data?.todos?.filter((todo) => todo.isCompleted == false)
    );
    setAllTodos(data?.todos.length);
  }, [data, currentTodoListState]);

  const [incompleteTodos, setIncompleteTodos] = useState(
    data?.todos?.filter((todo) => todo.isCompleted == false)
  );
  if (!incompleteTodos) setIncompleteTodos([]);

  const [completedTodos, setCompletedTodos] = useState(
    data?.todos?.filter((todo) => todo.isCompleted == true)
  );
  if (!completedTodos) setCompletedTodos([]);
  const [allTodos, setAllTodos] = useState(data?.todos.length);
  /**
   * @name markCompleted
   * @param {number} todoIndex
   * @description mark the todo complete and dispatch an action to change the global state
   */
  const markCompleted = (todoIndex: number) => {
    try {
      setCompletedTodos([...completedTodos, incompleteTodos[todoIndex]]);
      setIncompleteTodos(incompleteTodos);
      dispatch(toggleIscompleted(incompleteTodos[todoIndex]));
      incompleteTodos.splice(todoIndex, 1);
    } catch (error) {
      console.log(error);
    }
  };
  /**
   * @name markIncomplete
   * @param {number} todoIndex
   * @description mark the todo incomplete and dispatch an action to change the global state
   */
  const markIncomplete = (todoIndex: number) => {
    try {
      setIncompleteTodos([...incompleteTodos, completedTodos[todoIndex]]);
      dispatch(toggleIscompleted(completedTodos[todoIndex]));
      completedTodos.splice(todoIndex, 1);
    } catch (error) {
      console.log(error);
    }
  };
  /**
   * @name addTodo
   * @description dispatch an action if todo field is not empty and add todo to the list
   */
  const addTodo = () => {
    try {
      if (todo) {
        setFocus(false);
        setAllTodos(allTodos + 1);
        setIncompleteTodos([
          ...incompleteTodos,
          {
            id: allTodos,
            sectionId: id,
            title: todo,
            due: "",
            isImportant: false,
            isCompleted: false,
            subtasks: [],
            note: "",
          },
        ]);
        dispatch(
          addNewTodo({
            id: allTodos,
            sectionId: id,
            title: todo,
            due: "",
            isImportant: false,
            isCompleted: false,
            subtasks: [],
            note: "",
          })
        );
        setTodo("");
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {}, [incompleteTodos, completedTodos]);
  /**
   * @name expand
   * @description expander function to expand and contract the completed todo section
   */
  const expand = () => {
    setExpandCompleted(!expandCompleted);
  };
  /**
   * @name handleEnter
   * @param {Event} event
   * @description handles the keypress event for enter to add a new todo by calling addTodo function
   */
  const handleEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    try {
      if (event.key == "Enter") addTodo();
      else return;
    } catch (error) {
      console.log(error);
    }
  };
  /**
   * @name changeActiveLayout
   * @description handles the layout of the Todo between list and grid
   */
  const changeActiveLayout = () => {
    if (activeLayout == "list") setActiveLayout("grid");
    else setActiveLayout("list");
  };
  const [editId, setEditId] = useState({ id: 0, sectionId: "0" });
  /**
   * @name editMenuToggle
   * @param {number} id
   * @param {string} sectionId
   * @description handles the todo editor opening
   */
  const editMenuToggle = (id: number, sectionId: string) => {
    setMenuToggle(true);
    setEditId({ id, sectionId });
  };
  const [optionOpen, setOptionOpen] = useState(false);
  return (
    <>
      {optionOpen ? <Option /> : <></>}
      <div className="todo-wrapper">
        <div className="todo-header">
          <div className="todo-title">
            {!props?.sidebar ? (
              <div className="sidebar-toggle-button">
                <Button
                  source={toggle}
                  alt="sidebar toggle"
                  handleClick={props?.handleClick}
                />
              </div>
            ) : (
              <div className="sidebar-toggle-button">
                <Button
                  source={listIcon}
                  alt="todo icon"
                  handleClick={() => null}
                />
              </div>
            )}
            <div className="title-content">
              <div className="title">{data.name}</div>
              <div className="more-options" onBlur={() => setOptionOpen(false)}>
                <Button
                  source={dots}
                  alt="more options"
                  handleClick={() => {
                    setOptionOpen(!optionOpen);
                  }}
                />
              </div>
              <div className="view-options">
                {layouts.map((layout, layoutIndex) => {
                  return (
                    <div
                      key={layoutIndex}
                      className={`${layout?.name} ${
                        activeLayout == layout?.name ? "active" : ""
                      }`}
                    >
                      <Button
                        source={layout?.icon}
                        alt={layout?.name}
                        handleClick={changeActiveLayout}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="todo-options">
            <Button
              source={sort}
              alt="sort"
              handleClick={() => {
                return 0;
              }}
            />
            <Button
              source={groupLeft}
              alt="Group Left"
              handleClick={() => {
                return 0;
              }}
            />
          </div>
        </div>
        <div className="add-todo">
          <div className="input-field">
            <img src={checkbox} width="30px" />
            <div className="input-section">
              <input
                type="text"
                value={todo}
                onChange={(event) => setTodo(event.target.value)}
                onKeyDown={(event) => handleEnter(event)}
                onFocus={() => setFocus(!focus)}
              />
            </div>
          </div>
        </div>
        {focus ? (
          <div className="add-todo-options">
            {addTodoOptions.map((option, optionIndex) => {
              return (
                <div className="todo-options" key={optionIndex}>
                  <Button
                    source={option?.icon}
                    alt={option?.name}
                    handleClick={() => null}
                  />
                </div>
              );
            })}
            <div className="add-todo-button">
              <button onClick={addTodo}> Add </button>
            </div>
          </div>
        ) : (
          <></>
        )}
        {activeLayout == "grid" ? (
          <div className="todo-body">
            {allTodos ? (
              <div className="todo-list-header">
                <div className="radiobtn"> </div>
                <div className="task">Title</div>
                <div className="due-time">Due Date</div>
                <div className="important">Importance</div>
              </div>
            ) : (
              <></>
            )}
            {incompleteTodos &&
              incompleteTodos.map((todo, todoIndex) => {
                return (
                  <div className="todo-list-grid" key={todoIndex}>
                    <div
                      className="radiobtn"
                      onClick={() => markCompleted(todoIndex)}
                    >
                      <Button
                        source={checkbox}
                        alt="check"
                        handleClick={() => null}
                      />
                    </div>
                    <div
                      className="task"
                      onClick={() => editMenuToggle(todo.id, todo.sectionId)}
                    >
                      {todo?.title}
                    </div>
                    <div className="due-time">
                      {/* <input
                        value={dueDate == "" ? todo.due : dueDate}
                        onChange={(event) => setDueDate(event.target.value)}
                        onBlur={() => editDueDate(todo.id, todo.sectionId)}
                      /> */}
                      {todo.due}
                    </div>
                    <div className="important">
                      <Button
                        source={todo.isImportant ? starFilled : star}
                        alt="Mark Important"
                        handleClick={() => dispatch(toggleIsImportant(todo))}
                      />
                    </div>
                  </div>
                );
              })}
            {completedTodos && completedTodos.length > 0 ? (
              <div className="completed">
                <div className="completed-actions">
                  <Button
                    source={`${!expandCompleted ? rightArrow : expandIcon}`}
                    alt="expand"
                    handleClick={expand}
                  />
                  <p>Completed</p>
                  <p className="counter">{completedTodos.length}</p>
                </div>
                {expandCompleted ? (
                  <div className="completed">
                    {completedTodos.map((todo, todoIndex) => {
                      return (
                        <div
                          className="todo-list-completed-grid"
                          key={todoIndex}
                        >
                          <div
                            className="radiobtn"
                            onClick={() => markIncomplete(todoIndex)}
                          >
                            <Button
                              source={checkboxTick}
                              alt="check"
                              handleClick={() => null}
                            />
                          </div>
                          <div
                            className="task"
                            onClick={() =>
                              editMenuToggle(todo.id, todo.sectionId)
                            }
                          >
                            {todo?.title}
                          </div>{" "}
                          <div className="due-time">
                            {todo.due}
                          </div>
                          <div className="important">
                            <Button
                              source={todo.isImportant ? starFilled : star}
                              alt="Mark Important"
                              handleClick={() =>
                                dispatch(toggleIsImportant(todo))
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <div className="todo-body">
            {incompleteTodos &&
              incompleteTodos.map((todo, todoIndex) => {
                return (
                  <div className="todo-list" key={todoIndex}>
                    <div
                      className="radiobtn"
                      onClick={() => markCompleted(todoIndex)}
                    >
                      <Button
                        source={checkbox}
                        alt="check"
                        handleClick={() => null}
                      />
                    </div>
                    <div
                      className="task"
                      onClick={() => editMenuToggle(todo.id, todo.sectionId)}
                    >
                      {todo?.title}
                    </div>
                    <div className="important">
                      <Button
                        source={todo.isImportant ? starFilled : star}
                        alt="Mark Important"
                        handleClick={() => dispatch(toggleIsImportant(todo))}
                      />
                    </div>
                  </div>
                );
              })}

            {completedTodos && completedTodos.length > 0 ? (
              <div className="completed">
                <div className="completed-actions">
                  <Button
                    source={`${!expandCompleted ? rightArrow : expandIcon}`}
                    alt="expand"
                    handleClick={expand}
                  />
                  <p>Completed</p>
                  <p className="counter">{completedTodos.length}</p>
                </div>
                {expandCompleted ? (
                  <div className="completed">
                    {completedTodos.map((todo, todoIndex) => {
                      return (
                        <div
                          className="todo-list todo-list-completed "
                          key={todoIndex}
                        >
                          <div
                            className="radiobtn"
                            onClick={() => markIncomplete(todoIndex)}
                          >
                            <Button
                              source={checkboxTick}
                              alt="check"
                              handleClick={() => null}
                            />
                          </div>
                          <div
                            className="task"
                            onClick={() =>
                              editMenuToggle(todo.id, todo.sectionId)
                            }
                          >
                            {todo?.title}
                          </div>{" "}
                          <div className="important">
                            <Button
                              source={todo.isImportant ? starFilled : star}
                              alt="Mark Important"
                              handleClick={() =>
                                dispatch(toggleIsImportant(todo))
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
      {menuToggle ? (
        <TodoEditor editId={editId} menuToggle={setMenuToggle} />
      ) : (
        <></>
      )}
    </>
  );
};
