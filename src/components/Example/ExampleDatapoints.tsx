import { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space,message,Button } from 'antd';
import { pl_auto_datapoints,pl_home_datapoints } from '../../Utils';
import { Checkbox, Divider } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { values } from '@fluentui/react';

type objectProp =
{
  label:string|number
  value:string
}
type Props =
{
  selectedDatapoints: objectProp[],
  onSelectedDatapoints:(value: objectProp[])=>void,
  path:string|null,
  onSelectedPath:(value:string|null)=>void
}

export const ExampleDatapoints = ({selectedDatapoints, onSelectedDatapoints, path, onSelectedPath}:Props) =>
{

  const [showCheckbox, setShowCheckbox] = useState<boolean>(false)
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
  const [indeterminate, setIndeterminate] = useState<boolean>(true);
  const [checkAll, setCheckAll] = useState<boolean>(false);

  
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
    onSelectedPath(key)
    if(key == 'PersonalLines/Home' )
    {
      onSelectedDatapoints(pl_home_datapoints)
    }
    else if(key == 'PersonalLines/Auto' )
    {
      onSelectedDatapoints(pl_auto_datapoints)
    }
  };



  const onChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && !!selectedDatapoints && list.length < selectedDatapoints.length);
    setCheckAll(!!selectedDatapoints && list.length === selectedDatapoints.length);
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(e.target.checked ? selectedDatapoints.map((item)=> item?.label) : []);
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
      <CheckboxGroup options={selectedDatapoints.map((item)=> item?.label)} value={checkedList} onChange={onChange} />
  </>
  }
  </div>
  )
}













