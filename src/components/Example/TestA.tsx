import { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space,message,Button } from 'antd';
import { pl_auto_datapoints,pl_home_datapoints } from '../../Utils';
import { Checkbox, Divider } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';

type objectProp =
{
  label:string|number
  value:string
}

export const TestA = () =>
{

  const [showCheckbox, setShowCheckbox] = useState<boolean>(false)
  const [currentList, setCurrentList] = useState <objectProp[]>([])
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
  const [indeterminate, setIndeterminate] = useState<boolean>(true);
  const [checkAll, setCheckAll] = useState<boolean>(false);
  const [path, setPath] = useState<string|null>(null)

  console.log(checkedList)

  const CheckboxGroup = Checkbox.Group;

  const items: MenuProps['items'] =
[{
  key: "PersonalLines",
  label: "Personal Lines",
  children: [
    {
      key: "PersonalLines/Home",
      label: "Home"
    },
    {
      key: "PersonalLines/Auto",
      label: "Auto",
    }
  ]},
  {
    key: "CommercialLines",
    label: "Commercial Lines"
  },
  {
    key: "Claims",
    label: "Claims"
  }
];

  const onClick: MenuProps['onClick'] = ({ key }) => {
    // console.log(key)
    // message.info(`Click on item ${key}`);
    setShowCheckbox(!!key)
    setPath(key)
    if(key == 'PersonalLines/Home' )
    {
      setCurrentList(pl_home_datapoints)
    }
    else if(key == 'PersonalLines/Auto' )
    {
      setCurrentList(pl_auto_datapoints)
    }
  };



  const onChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && !!currentList && list.length < currentList.length);
    setCheckAll(!!currentList && list.length === currentList.length);
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(e.target.checked ? currentList.map((item)=> item?.label) : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  return(
  <div>
  <Dropdown menu={{ items,onClick }}>
    <a onClick={(e) => e.preventDefault()}>
      <Space>
      <Button>{path??"Choose your datapoints"}</Button>
      </Space>
    </a>
  </Dropdown>
  {showCheckbox &&
  <>
  <br/>
  <br/>
        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
        Choose All Datapoints
      </Checkbox>
      <Divider />
      <CheckboxGroup options={currentList.map((item)=> item?.label)} value={checkedList} onChange={onChange} />
  </>
  }
  </div>
  )
}













