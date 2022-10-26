
/**
 * Supply Helper Methods
 */
export default abstract class Helper {
  static eventList: { [key: string]: { [key: string]: any } } = {}

  static bounce(name: string, wait: number, callback?: (name: string) => void | boolean, context?: any) {
    if (typeof (wait) !== 'number') { wait = 0 }
    if (!this.eventList) { this.eventList = {} }

    const event = (this.eventList[name] = (this.eventList[name] ?? {}))
    const bounce = event['bounce'] ?? false

    if (bounce) {
      clearTimeout(bounce)
    }

    if (wait >= 0) {
      event['bounce'] = setTimeout(() => {
        delete event['bounce']
        if (callback?.call(context instanceof Function ? context() : context, name)) {
          this.bounce(name, wait, callback, context)
        }
      }, wait)
    } else {
      event['bounce'] && delete event['bounce']
    }

    return (bounce === false)
  }

  static queue(name: string, wait: number, callback: (name: string) => void, complete?: (name: string) => any, context?: any, args?: any) {
    if (typeof (wait) !== 'number') { wait = 0 }
    if (!this.eventList) { this.eventList = {} }

    const event = (this.eventList[name] = (this.eventList[name] ?? {}))
    const queue = event['queue'] ?? false

    context = (context instanceof Function ? context() : context)
    callback = callback.bind(context)
    complete && (complete = complete.bind(context))

    if (queue) {
      queue['stack'].push(callback)
      queue['args'].push(args)
      complete && (queue['complete'] = complete)
      clearTimeout(queue['timeout'])
    } else {
      event['queue'] = { 'stack': [callback], 'args': [args] }
      complete && (event['queue']['complete'] = complete)
    }

    const processStack = (stack: Function[], args: any) => {
      const results: any[] = []
      for (const index in stack) {
        results.push(stack[index](args[index]))
      }
      return results
    }

    if (wait >= 0) {
      event['queue']['timeout'] = setTimeout(() => {
        const results = processStack(event['queue']['stack'], event['queue']['args'])
        event['queue']['complete'] && event['queue']['complete'](results)
        delete event['queue']
      }, wait)
    } else {
      const results = processStack(event['queue']['stack'], event['queue']['args'])
      event['queue']['complete'] && event['queue']['complete'](results)
      delete event['queue']
    }

    return (queue === false)
  }

  static throttle(name: string, wait: number, callback: (name: string) => void) {
    if (typeof (wait) !== 'number') { wait = 0 }
    if (!this.eventList) { this.eventList = {} }

    const event = (this.eventList[name] = (this.eventList[name] ?? {}))
    const throttle = event['throttle'] || 0
    const now = new Date().getTime()

    if (now >= throttle) {
      event['throttle'] = now + wait
      callback(name)
      return true
    }
    return false
  }

  static sanitizeRegex(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  static sanitize(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '')
  }
}