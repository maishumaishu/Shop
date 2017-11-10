import { defaultNavBar, app, formatDate } from 'site';
import { AccountService } from 'userServices/accountService';
import { DataList } from 'user/components/dataList';

export default function (page: chitu.Page) {
    class ScroeListComponent extends React.Component<{}, {}>{
        private loadData() {
            return Promise.resolve([]);
        }
        private typeText(item: ScoreDetail) {
            switch (item.Type) {
                case 'OrderPurchase':
                    return '兑换商品';
                case 'OrderConsume':
                    return '消费获得积分';
            }
            return item.Type;
        }
        render() {
            return [
                <header key="header">
                    {defaultNavBar({ title: '我的积分' })}
                </header>,
                <section key="view">
                    <div className="container">
                        <DataList loadData={() => this.loadData()} pageSize={10000}
                            dataItem={(o: ScoreDetail) =>
                                <div style={{ marginTop: 10 }}>
                                    <div className="row" style={{ padding: '0px 10px 0px 10px' }}>
                                        <div className="pull-left">{formatDate(o.CreateDateTime)}</div>
                                        <div className="pull-right">
                                            结余：<span data-bind="text: Balance">{o.Balance}</span>
                                        </div>
                                    </div>
                                    <div className="row" style={{ padding: '6px 10px 0px 10px' }}>
                                        <div className="pull-left">{this.typeText(o)}</div>
                                        <div className="pull-right">{o.Score}</div>
                                    </div>
                                    <hr className="row" style={{ marginTop: '10px; margin-bottom: 10px' }} />
                                </div>
                            }
                            emptyItem={
                                <div className="norecords">
                                    <div className="icon">
                                        <i className="icon-money" style={{ fontSize: 100, top: 34 }}>
                                        </i>
                                    </div>
                                    <h4 className="text">暂无积分记录</h4>
                                </div>
                            } />

                    </div>
                </section>
            ];
        }
    }

    ReactDOM.render(<ScroeListComponent />, page.element);
}