import type { QueryFormField } from '@/components/QueryForm/types'
import QueryTable from '@/components/QueryTable'
import type {
  QueryTableColumn,
  QueryTableSearchFn
} from '@/components/QueryTable/types'
import { sleep } from '@/utils/sleep'
import { Button } from 'antd'
import { useCallback, useMemo } from 'react'

type Product = {
  id: string
  name: string
}

export default function QueryTablePage() {
  const search = useCallback<QueryTableSearchFn>(async () => {
    await sleep(500)
    return {
      data: [
        {
          id: 1,
          title: 'Essence Mascara Lash Princess'
        },
        {
          id: 2,
          title: 'Eyeshadow Palette with Mirror'
        },
        {
          id: 3,
          title: 'Powder Canister'
        },
        {
          id: 4,
          title: 'Red Lipstick'
        },
        {
          id: 5,
          title: 'Red Nail Polish'
        },
        {
          id: 6,
          title: 'Calvin Klein CK One'
        },
        {
          id: 7,
          title: 'Chanel Coco Noir Eau De'
        },
        {
          id: 8,
          title: "Dior J'adore"
        },
        {
          id: 9,
          title: 'Dolce Shine Eau de'
        },
        {
          id: 10,
          title: 'Gucci Bloom Eau de'
        },
        {
          id: 11,
          title: 'Annibale Colombo Bed'
        },
        {
          id: 12,
          title: 'Annibale Colombo Sofa'
        },
        {
          id: 13,
          title: 'Bedside Table African Cherry'
        },
        {
          id: 14,
          title: 'Knoll Saarinen Executive Conference Chair'
        },
        {
          id: 15,
          title: 'Wooden Bathroom Sink With Mirror'
        },
        {
          id: 16,
          title: 'Apple'
        },
        {
          id: 17,
          title: 'Beef Steak'
        },
        {
          id: 18,
          title: 'Cat Food'
        },
        {
          id: 19,
          title: 'Chicken Meat'
        },
        {
          id: 20,
          title: 'Cooking Oil'
        },
        {
          id: 21,
          title: 'Cucumber'
        },
        {
          id: 22,
          title: 'Dog Food'
        },
        {
          id: 23,
          title: 'Eggs'
        },
        {
          id: 24,
          title: 'Fish Steak'
        },
        {
          id: 25,
          title: 'Green Bell Pepper'
        },
        {
          id: 26,
          title: 'Green Chili Pepper'
        },
        {
          id: 27,
          title: 'Honey Jar'
        },
        {
          id: 28,
          title: 'Ice Cream'
        },
        {
          id: 29,
          title: 'Juice'
        },
        {
          id: 30,
          title: 'Kiwi'
        }
      ],
      total: 30
    }
  }, [])

  const columns = useMemo<QueryTableColumn<Product>[]>(
    () => [
      {
        key: 'id',
        title: 'ID'
      },
      {
        key: 'title',
        title: '标题',
        width: 320
      },
      {
        key: 'description',
        title: '描述',
        defaultHidden: true
      },
      {
        key: 'category',
        title: '类目'
      },
      {
        key: 'brand',
        title: '品牌'
      },
      {
        key: 'price',
        title: '价格'
      },
      {
        key: 'discount',
        title: '折扣'
      },
      {
        key: 'returnPolicy',
        title: '退货政策'
      },
      {
        key: 'stock',
        title: '库存'
      },
      {
        key: 'date',
        title: '上市日期'
      },
      {
        key: 'tags',
        title: '商品标签'
      },
      {
        key: 'sales',
        title: '最近一月销量',
        width: 150
      },
      {
        key: 'rating',
        title: '评分'
      },
      {
        key: 'op',
        title: '操作',
        fixed: 'right'
      }
    ],
    []
  )

  const queryFields = useMemo<QueryFormField[]>(
    () => [
      {
        name: 'title',
        label: 'Title'
      }
    ],
    []
  )

  return (
    <QueryTable
      title="Products"
      queryFields={queryFields}
      columns={columns}
      onSearch={search}
      toolbar={[
        {
          key: 'export',
          content: (
            <Button size="small" type="primary">
              Export
            </Button>
          )
        }
      ]}
    />
  )
}
