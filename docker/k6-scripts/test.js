import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';

export default function () {
  const url = __ENV.TEST_URL;
  const res = http.get(url);
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}
