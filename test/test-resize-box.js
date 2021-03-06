import assert from 'power-assert';
import React from 'react';
import ReactDOM from 'react-dom';
import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';
import Resizable from '../src';

const mouseMove = (x, y) => {
  const event = document.createEvent('MouseEvents');
  event.initMouseEvent('mousemove', true, true, window,
                       0, 0, 0, x, y, false, false, false, false, 0, null);
  document.dispatchEvent(event);
  return event;
};

const mouseUp = (x, y) => {
  const event = document.createEvent('MouseEvents');
  event.initMouseEvent('mouseup', true, true, window,
                       0, 0, 0, x, y, false, false, false, false, 0, null);
  document.dispatchEvent(event);
  return event;
};

describe('Resizable Component test', () => {
  beforeEach(() => {
    document.body.innerHTML = window.__html__['test/fixtures.html'];
  });

  it('Should box width and height equal 100px', (done) => {
    const resizable = TestUtils.renderIntoDocument(<Resizable width={100} height={100} />);
    const divs = TestUtils.scryRenderedDOMComponentsWithTag(resizable, 'div');
    assert.equal(divs.length, 9);
    assert.equal(divs[0].style.width, '100px');
    assert.equal(divs[0].style.height, '100px');
    assert.equal(divs[0].style.position, 'relative');
    done();
  });

  it('Should box width and height equal auto', (done) => {
    const resizable = TestUtils.renderIntoDocument(<Resizable width="auto" height="auto" />);
    const divs = TestUtils.scryRenderedDOMComponentsWithTag(resizable, 'div');
    assert.equal(divs.length, 9);
    assert.equal(divs[0].style.width, 'auto');
    assert.equal(divs[0].style.height, 'auto');
    assert.equal(divs[0].style.position, 'relative');
    done();
  });

  it('Should style is applied to box', (done) => {
    const resizable = TestUtils.renderIntoDocument(
      <Resizable customStyle={{ position: 'absolute' }} />
    );
    const divs = TestUtils.scryRenderedDOMComponentsWithTag(resizable, 'div');
    assert.equal(divs.length, 9);
    assert.equal(divs[0].style.position, 'absolute');
    done();
  });

  it('Should custom class name be applied to box', (done) => {
    const resizable = TestUtils.renderIntoDocument(<Resizable customClass={"custom-class-name"} />);
    const divs = TestUtils.scryRenderedDOMComponentsWithTag(resizable, 'div');
    assert.equal(divs.length, 9);
    assert.equal(divs[0].className, 'custom-class-name');
    done();
  });

  it('Should custom class name be applied to resizer', (done) => {
    const resizable = TestUtils.renderIntoDocument(<Resizable handleClass={{ right: 'right-handle-class' }} />);
    const divs = TestUtils.scryRenderedDOMComponentsWithTag(resizable, 'div');
    const node = ReactDOM.findDOMNode(divs[2]);
    assert.equal(node.getAttribute('class'), 'right-handle-class');
    done();
  });

  it('Should not render resizer when isResizable props all false', () => {
    const resizable = TestUtils.renderIntoDocument(
      <Resizable
        isResizable={{
          top: false,
          right: false,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
      />
    );
    const divs = TestUtils.scryRenderedDOMComponentsWithTag(resizable, 'div');
    assert.equal(divs.length, 1);
  });

  it('Should render one resizer when one isResizable props set true', () => {
    const resizable = TestUtils.renderIntoDocument(
      <Resizable
        isResizable={{
          top: false,
          right: true,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
      />
    );
    const divs = TestUtils.scryRenderedDOMComponentsWithTag(resizable, 'div');
    assert.equal(divs.length, 2);
  });

  it('Should render two resizer when two isResizable props set true', () => {
    const resizable = TestUtils.renderIntoDocument(
      <Resizable
        isResizable={{
          top: true,
          right: true,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
      />
    );
    const divs = TestUtils.scryRenderedDOMComponentsWithTag(resizable, 'div');
    assert.equal(divs.length, 3);
  });

  it('Should render three resizer when three isResizable props set true', () => {
    const resizable = TestUtils.renderIntoDocument(
      <Resizable
        isResizable={{
          top: true,
          right: true,
          bottom: true,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
      />
    );
    const divs = TestUtils.scryRenderedDOMComponentsWithTag(resizable, 'div');
    assert.equal(divs.length, 4);
  });

  it('Should only right is resizable and call onResizeStart when mousedown', () => {
    const onResizeStart = sinon.spy();
    const resizable = TestUtils.renderIntoDocument(
      <Resizable
        onResizeStart={onResizeStart}
        isResizable={{
          top: false,
          right: true,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
      />
    );
    const divs = TestUtils.scryRenderedDOMComponentsWithTag(resizable, 'div');
    assert.equal(divs.length, 2);
    TestUtils.Simulate.mouseDown(ReactDOM.findDOMNode(divs[1]));
    assert.equal(onResizeStart.callCount, 1);
    assert.equal(onResizeStart.getCall(0).args[0], 'right');
  });

  it('Should only bottom is resizable and call onResizeStart when mousedown', () => {
    const onResizeStart = sinon.spy();
    const resizable = TestUtils.renderIntoDocument(
      <Resizable
        onResizeStart={onResizeStart}
        isResizable={{
          top: false,
          right: false,
          bottom: true,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
      />
    );
    const divs = TestUtils.scryRenderedDOMComponentsWithTag(resizable, 'div');
    assert.equal(divs.length, 2);
    TestUtils.Simulate.mouseDown(ReactDOM.findDOMNode(divs[1]));
    assert.equal(onResizeStart.callCount, 1);
    assert.equal(onResizeStart.getCall(0).args[0], 'bottom');
  });

  it('Should only bottomRight is resizable and call onResizeStart when mousedown', () => {
    const onResizeStart = sinon.spy();
    const resizable = TestUtils.renderIntoDocument(
      <Resizable
        onResizeStart={onResizeStart}
        isResizable={{
          top: false,
          right: false,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: true,
          bottomLeft: false,
          topLeft: false,
        }}
      />
    );
    const divs = TestUtils.scryRenderedDOMComponentsWithTag(resizable, 'div');
    assert.equal(divs.length, 2);
    TestUtils.Simulate.mouseDown(ReactDOM.findDOMNode(divs[1]));
    assert.equal(onResizeStart.callCount, 1);
    assert.equal(onResizeStart.getCall(0).args[0], 'bottomRight');
  });

  it('should call onResize with expected args when resize direction right', () => {
    const onResize = sinon.spy();
    const onResizeStart = sinon.spy();
    const resizable = ReactDOM.render(
      <Resizable
        width={100} height={100}
        onResize={onResize}
        onResizeStart={onResizeStart}
        customStyle={{ padding: '40px' }}
      />,
      document.getElementById('content')
    );
    const divs = TestUtils.scryRenderedDOMComponentsWithTag(resizable, 'div');
    const node = ReactDOM.findDOMNode(divs[2]);
    TestUtils.Simulate.mouseDown(node, { clientX: 0, clientY: 0 });
    mouseMove(200, 220);
    TestUtils.Simulate.mouseUp(node);
    assert.equal(onResize.callCount, 1);
    assert.equal(onResize.getCall(0).args[0], 'right');
    assert.deepEqual(onResize.getCall(0).args[1], { width: 300, height: 100 });
    assert.deepEqual(onResize.getCall(0).args[2], { width: 380, height: 180 });
  });

  it('should call onResize with expected args when resize direction bottom', () => {
    const onResize = sinon.spy();
    const onResizeStart = sinon.spy();
    const resizable = ReactDOM.render(
      <Resizable
        width={100} height={100}
        onResize={onResize}
        onResizeStart={onResizeStart}
        customStyle={{ padding: '40px' }}
      />,
      document.getElementById('content')
    );
    const divs = TestUtils.scryRenderedDOMComponentsWithTag(resizable, 'div');
    const node = ReactDOM.findDOMNode(divs[3]);
    TestUtils.Simulate.mouseDown(node, { clientX: 0, clientY: 0 });
    mouseMove(200, 220);
    TestUtils.Simulate.mouseUp(node);
    assert.equal(onResize.callCount, 1);
    assert.equal(onResize.getCall(0).args[0], 'bottom');
    assert.deepEqual(onResize.getCall(0).args[1], { width: 100, height: 320 });
    assert.deepEqual(onResize.getCall(0).args[2], { width: 180, height: 400 });
  });

  it('should call onResize with expected args when resize direction bottomRight', () => {
    const onResize = sinon.spy();
    const onResizeStart = sinon.spy();
    const resizable = ReactDOM.render(
      <Resizable
        width={100} height={100}
        onResize={onResize}
        onResizeStart={onResizeStart}
        customStyle={{ padding: '40px' }}
      />,
      document.getElementById('content')
    );
    const divs = TestUtils.scryRenderedDOMComponentsWithTag(resizable, 'div');
    const node = ReactDOM.findDOMNode(divs[6]);
    TestUtils.Simulate.mouseDown(node, { clientX: 0, clientY: 0 });
    mouseMove(200, 220);
    TestUtils.Simulate.mouseUp(node);
    assert.equal(onResize.callCount, 1);
    assert.equal(onResize.getCall(0).args[0], 'bottomRight');
    assert.deepEqual(onResize.getCall(0).args[1], { width: 300, height: 320 });
    assert.deepEqual(onResize.getCall(0).args[2], { width: 380, height: 400 });
  });

  it('should call onResizeStop when resize stop direction right', () => {
    const onResize = sinon.spy();
    const onResizeStart = sinon.spy();
    const onResizeStop = sinon.spy();
    const resizable = ReactDOM.render(
      <Resizable
        width={100} height={100}
        onResize={onResize}
        onResizeStart={onResizeStart}
        onResizeStop={onResizeStop}
        customStyle={{ padding: '40px' }}
      />,
      document.getElementById('content')
    );
    const divs = TestUtils.scryRenderedDOMComponentsWithTag(resizable, 'div');
    const node = ReactDOM.findDOMNode(divs[2]);
    TestUtils.Simulate.mouseDown(node, { clientX: 0, clientY: 0 });
    mouseMove(200, 220);
    mouseUp(200, 220);
    assert.equal(onResizeStop.callCount, 1);
    assert.deepEqual(onResizeStop.getCall(0).args[0], 'right');
    assert.deepEqual(onResizeStop.getCall(0).args[1], { width: 300, height: 100 });
    assert.deepEqual(onResizeStop.getCall(0).args[2], { width: 380, height: 180 });
  });

  it('should call onResizeStop when resize stop direction bottom', () => {
    const onResize = sinon.spy();
    const onResizeStart = sinon.spy();
    const onResizeStop = sinon.spy();
    const resizable = ReactDOM.render(
      <Resizable
        width={100} height={100}
        onResize={onResize}
        onResizeStart={onResizeStart}
        onResizeStop={onResizeStop}
        customStyle={{ padding: '40px' }}
      />,
      document.getElementById('content')
    );
    const divs = TestUtils.scryRenderedDOMComponentsWithTag(resizable, 'div');
    const node = ReactDOM.findDOMNode(divs[3]);
    TestUtils.Simulate.mouseDown(node, { clientX: 0, clientY: 0 });
    mouseMove(200, 220);
    mouseUp(200, 220);
    assert.equal(onResizeStop.callCount, 1);
    assert.deepEqual(onResizeStop.getCall(0).args[0], 'bottom');
    assert.deepEqual(onResizeStop.getCall(0).args[1], { width: 100, height: 320 });
    assert.deepEqual(onResizeStop.getCall(0).args[2], { width: 180, height: 400 });
  });

  it('should call onResizeStop when resize stop direction bottomRight', () => {
    const onResize = sinon.spy();
    const onResizeStart = sinon.spy();
    const onResizeStop = sinon.spy();
    const resizable = ReactDOM.render(
      <Resizable
        width={100} height={100}
        onResize={onResize}
        onResizeStart={onResizeStart}
        onResizeStop={onResizeStop}
        customStyle={{ padding: '40px' }}
      />,
      document.getElementById('content')
    );
    const divs = TestUtils.scryRenderedDOMComponentsWithTag(resizable, 'div');
    const node = ReactDOM.findDOMNode(divs[6]);
    TestUtils.Simulate.mouseDown(node, { clientX: 0, clientY: 0 });
    mouseMove(200, 220);
    mouseUp(200, 220);
    assert.equal(onResizeStop.callCount, 1);
    assert.deepEqual(onResizeStop.getCall(0).args[0], 'bottomRight');
    assert.deepEqual(onResizeStop.getCall(0).args[1], { width: 300, height: 320 });
    assert.deepEqual(onResizeStop.getCall(0).args[2], { width: 380, height: 400 });
  });

  afterEach(done => {
    ReactDOM.unmountComponentAtNode(document.body);
    document.body.innerHTML = '';
    setTimeout(done);
  });
});
