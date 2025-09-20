# 工作日志计时功能测试

## 测试覆盖的功能

### 1. useTimer Hook 测试
- ✅ 2/4/6 小时整点提醒功能
- ✅ 用户取消提醒时停止计时
- ✅ 8小时自动停止功能
- ✅ 页面可见性变化时的提醒
- ✅ 页面卸载保护
- ✅ 暂停和恢复功能
- ✅ 正常停止计时功能

### 2. CustomEventBlock 组件测试
- ✅ 开始/暂停/恢复/停止按钮功能
- ✅ 自动停止状态显示
- ✅ 完成状态显示
- ✅ 不同时长事件的渲染（最短/短/长）
- ✅ 标签显示功能
- ✅ 只读模式处理
- ✅ 时长计算和格式化

## 运行测试

### 运行所有测试
```bash
npm test
```

### 运行特定测试文件
```bash
# 只运行 useTimer 测试
npm test src/hooks/__tests__/useTimer.test.tsx

# 只运行 CustomEventBlock 测试
npm test src/components/event/__tests__/CustomEventBlock.test.tsx
```

### 运行测试并查看覆盖率
```bash
npm run test:coverage
```

### 运行测试并打开 UI 界面
```bash
npm run test:ui
```

## 测试场景说明

### 时间推进测试
测试使用 `vi.useFakeTimers()` 和 `vi.advanceTimersByTimeAsync()` 来模拟时间推进：

```javascript
// 推进 2 小时
await vi.advanceTimersByTimeAsync(2 * 60 * 60 * 1000);

// 推进 8 小时
await vi.advanceTimersByTimeAsync(8 * 60 * 60 * 1000);
```

### 用户交互测试
测试使用 `fireEvent` 来模拟用户点击：

```javascript
// 模拟点击开始按钮
fireEvent.click(screen.getByTitle('Start'));

// 模拟点击暂停按钮
fireEvent.click(screen.getByTitle('Pause'));
```

### 页面事件测试
测试使用 `dispatchEvent` 来模拟页面事件：

```javascript
// 模拟页面可见性变化
document.dispatchEvent(new Event('visibilitychange'));

// 模拟页面卸载
window.dispatchEvent(new Event('beforeunload'));
```

## 测试数据

测试使用以下模拟数据：

```javascript
const baseLog = {
  id: 'e1',
  title: 'Deep Work',
  start: '2025-01-01T08:00:00.000Z',
  end: '2025-01-01T08:00:00.000Z',
  extendedProps: {
    type: 'deep',
    category: 'Focus',
    inProgress: true,
    isPaused: false,
    description: 'Test'
  }
};
```

## 注意事项

1. 测试使用假时钟，需要手动推进时间
2. 每个测试后都会清理 mock 和 localStorage
3. 测试覆盖了正常流程和异常情况
4. 所有测试都是独立的，可以并行运行
