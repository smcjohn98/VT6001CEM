import * as tf from '@tensorflow/tfjs';
import { TensorflowPointEnum } from './data';

export function drawSegment(ctx, [mx, my], [tx, ty], color) {
    ctx.beginPath()
    ctx.moveTo(mx, my)
    ctx.lineTo(tx, ty)
    ctx.lineWidth = 5
    ctx.strokeStyle = color
    ctx.stroke()
}

export function drawPoint(ctx, x, y, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

export function getCenterPoint(landmarks, left_bodypart, right_bodypart) {
    let left = tf.gather(landmarks, left_bodypart, 1)
    let right = tf.gather(landmarks, right_bodypart, 1)
    const center = tf.add(tf.mul(left, 0.5), tf.mul(right, 0.5))
    return center
}

export function getPoseSize(landmarks, torso_size_multiplier = 2.5) {
    let hips_center = getCenterPoint(landmarks, TensorflowPointEnum.LEFT_HIP, TensorflowPointEnum.RIGHT_HIP)
    let shoulders_center = getCenterPoint(landmarks, TensorflowPointEnum.LEFT_SHOULDER, TensorflowPointEnum.RIGHT_SHOULDER)
    let torso_size = tf.norm(tf.sub(shoulders_center, hips_center))
    let pose_center_new = getCenterPoint(landmarks, TensorflowPointEnum.LEFT_HIP, TensorflowPointEnum.RIGHT_HIP)
    pose_center_new = tf.expandDims(pose_center_new, 1)

    pose_center_new = tf.broadcastTo(pose_center_new,
        [1, 17, 2]
    )
    let d = tf.gather(tf.sub(landmarks, pose_center_new), 0, 0)
    let max_dist = tf.max(tf.norm(d, 'euclidean', 0))

    let pose_size = tf.maximum(tf.mul(torso_size, torso_size_multiplier), max_dist)
    return pose_size
}

export function normalizePoseLandmarks(landmarks) {
    let pose_center = getCenterPoint(landmarks, TensorflowPointEnum.LEFT_HIP, TensorflowPointEnum.RIGHT_HIP)
    pose_center = tf.expandDims(pose_center, 1)
    pose_center = tf.broadcastTo(pose_center,
        [1, 17, 2]
    )
    landmarks = tf.sub(landmarks, pose_center)

    let pose_size = getPoseSize(landmarks)
    landmarks = tf.div(landmarks, pose_size)
    return landmarks
}

export function landmarksToEmbedding(landmarks) {
    landmarks = normalizePoseLandmarks(tf.expandDims(landmarks, 0))
    let embedding = tf.reshape(landmarks, [1, 34])
    return embedding
}