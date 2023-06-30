import { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space,message,Button } from 'antd';
import { pl_auto_datapoints,pl_home_datapoints } from '../../Utils';
import { Checkbox, Divider } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { values } from '@fluentui/react';
import type {objectProp} from "../../Utils"
type Props =
{
  onSend:(questions: string)=>void,
  selectedDatapoints: CheckboxValueType[],
  onSelectedDatapoints:(value: CheckboxValueType[])=>void,
  path:string|null,
  onSelectedPath:(value:string|null)=>void
}

export const ExampleDatapoints = ({onSend,selectedDatapoints, onSelectedDatapoints, path, onSelectedPath}:Props) =>
{

  const [showCheckbox, setShowCheckbox] = useState<boolean>(false)
  const [checkedList, setCheckedList] = useState<objectProp[]>([]);
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
      setCheckedList(pl_home_datapoints)
    }
    else if(key == 'PersonalLines/Auto' )
    {
      setCheckedList(pl_auto_datapoints)
    }
    else
    {
      setCheckedList([])
    }
  };



  const onChange = (list: CheckboxValueType[]) => {
    onSelectedDatapoints(list);
    setIndeterminate(!!list.length && !!checkedList && list.length < checkedList.length);
    setCheckAll(!!checkedList && list.length === checkedList.length);
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    onSelectedDatapoints(e.target.checked ? checkedList.map((item)=> item?.label) : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const onSendData = (e: any) =>
  {
    if(selectedDatapoints && selectedDatapoints.length>0)
    {
      let question = selectedDatapoints.toString()
      console.log(question)
      onSend(question)
    }


  }

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
      <CheckboxGroup options={checkedList.map((item)=> item?.label)} value={selectedDatapoints} onChange={onChange} />
      <Button style={{marginTop:'5%'}}  shape="round" size="small" onClick={ onSendData}>
        Get Datapoints
      </Button>
  </>
  }
  </div>
  )
}













