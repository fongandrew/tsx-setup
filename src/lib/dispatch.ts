/*
  Dispatch current dispatcher in context
*/
import { get } from '@/context';

export default function dispatch<K extends keyof ActionT>(action: ActionT[K]) {
  return get('dispatcher').dispatch(action);
}
