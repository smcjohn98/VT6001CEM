import chair from './pose_images/chair.png'
import cobra from './pose_images/cobra.png'
import dog from './pose_images/dog.png'
import tree from './pose_images/tree.jpg'
import warrior from './pose_images/warrior.png'
import warrior2 from './pose_images/warrior2.png'
import traingle from './pose_images/traingle.png'
import shoulderstand from './pose_images/shoulderstand.png'

export const REP_POSE = 0
export const HOLD_POSE = 1

export const poseList = {
    Tree: {
        description:'From a standing position, one foot is rooted into the earth with the opposite heel rooted into the inner thigh with the toes pointing toward the earth. The pelvis and the chin are tucked in. The hands come together at the heart in prayer position. The gaze is forward.',
        benefit:'trengthens the legs, ankles, and feet. Improves flexibility in the hips and knees. Improves balance.',
        image: tree,
        type: HOLD_POSE,
        defaultNum: 30
    },
    Cobra: {
        description:'Begin by lying face down with your legs extended behind you, hip-width apart and the tops of your feet rested. Spread your fingers wide and place your hands under your shoulders with your fingers pointing toward the top of the mat. Hug your elbows into the sides of your body. Press down through the tops of your feet and lift your head and chest off the floor. Keep your lower ribs on the floor. Draw your shoulders back and your heart forward keeping your head a natural extension of your spine and your shoulders rolled down and away from your ears. Begin to straighten your arms and lift your chest off the floor. Press the tops of your thighs down firmly into the floor. This is Low Cobra. Little to no weight on your hands. If your flexibility allows, you can straighten your arms all the way while maintaining the connection of the front of your pelvis and legs with the floor.',
        benefit:'Increases spine flexibility. Stretches the chest and abdominals while strengthening the spine and shoulders.',
        image: cobra,
        type: HOLD_POSE,
        defaultNum: 30
    },
    Dog: {
        description:'The body is positioned in an inverted "V" with the palms and feet rooted into the earth and sits bones lifted up toward the sky. The arms and legs are straight. The weight of the body is equally distributed between the hands and the feet. The eye of the elbows face forward. The ribcage is lifted and the heart is open. Shoulders are squared to the earth and rotated back, down and inward. The neck is relaxed and the crown of the head is toward the earth. The gaze is down and slightly forward.',
        benefit:'Calms the brain and helps relieve stress and mild depression. Energizes the body. Stretches the shoulders, hamstrings, calves, arches, and hands. Strengthens the arms and legs. Helps relieve the symptoms of menopause. Relieves menstrual discomfort when done with the head supported. Helps prevent osteoporosis. Improves digestion. Relieves headache, insomnia, back pain, and fatigue. Therapeutic for high blood pressure, asthma, flat feet, sciatica, and sinusitis. Warms up the ankles and the toes.',
        image: dog,
        type: HOLD_POSE,
        defaultNum: 30
    },
    Chair: {
        description:'From a standing position, the feet are together and rooted into the earth with toes actively lifted. The knees are bent and the weight of the body is on the heels of the feet. The pelvis is tucked in and the ribcage is lifted. The neck is a natural extension of the spine. The arms are lifted up toward the sky with the elbows straight and the biceps by the ears. The hands can be together or separated and facing each other with the fingers spread wide. The gaze is forward.',
        benefit:'Strengthens the ankles, thighs, calves, and spine. Stretches shoulders and chest. Stimulates the abdominal organs, diaphragm, and heart. Reduces flat feet. Energizes the entire body.',
        image: chair,
        type: HOLD_POSE,
        defaultNum: 30
    },
    Warrior: {
        description:'From a standing position, one leg is rooted and perpendicular to the earth while the other leg is raised, extended back and parallel to the earth. The head of the thighbone of the standing leg presses back toward the heel and is actively rooted into the earth. The arms and the extended leg lengthen in opposing directions with Bandhas engaged. The hips are squared and the tailbone presses firmly into the pelvis. The arms, torso, and extended raised leg should be positioned relatively parallel to the floor. The gaze is forward or down.',
        benefit:'Strengthens the ankles and legs. Strengthens the shoulders and muscles of the back. Tones the abdomen. Improves balance and posture.',
        image: warrior,
        type: HOLD_POSE,
        defaultNum: 30
    },
    Warrior2: {
        description:'From a standing position, the legs are separated into a wide stance. The front knee is bent in a 90-degree angle directly above the ankle. The back leg is extended and straight with the outside edge of the back foot gripping the earth in a 60-degree angle toward the front. The inner thighs are externally rotated away from each other. The pelvis is tucked. The ribcage is lifted. The arms are extended out to the sides and are aligned with the shoulders in a straight line with the fingers reaching out as the shoulder blades squeeze together. The gaze is toward the front fingers.',
        benefit:'Strengthens and stretches the legs and ankles. Stretches the groin, chest, lungs, and shoulders. Stimulates abdominal organs. Increases stamina. Relieves backaches, especially through second trimester of pregnancy. Therapeutic for carpal tunnel syndrome, flat feet, infertility, osteoporosis, and sciatica.',
        image: warrior2,
        type: HOLD_POSE,
        defaultNum: 30
    },
    Traingle: {
        description:'From a standing position, the legs are straight and separated into a wide stance. The feet are aligned and flat on the earth with the back foot in a 60-degree angle toward the front. The inner thighs are rotated externally away from each other. The pelvis is tucked and the ribcage is lifted. One arm extends up toward the sky as the other reaches down to the earth. Both arms are aligned with the shoulders in a straight line. The fingers reach out as the shoulder blades squeeze together. The gaze is toward the front.',
        benefit:'Stretches and strengthens the thighs, knees, and ankles. Stretches the hips, groin, hamstrings, calves, shoulders, chest, and spine. Stimulates the abdominal organs. Helps relieve stress. Improves digestion. Helps relieve the symptoms of menopause. Relieves backache, especially through second trimester of pregnancy. Therapeutic for anxiety, flat feet, infertility, neck pain, osteoporosis, and sciatica.',
        image: traingle,
        type: HOLD_POSE,
        defaultNum: 30
    },
    Shoulderstand: {
        description:'From a supine position, the upper back is resting on the earth with the hips straight up toward the sky. The torso is perpendicular to the earth. The legs are fully extended and the toes are active. The hands are either supporting the lower back or extended up by the side body in matchstick. The weight rests on the center of the back of your skull and the neck maintains its natural curvature. The chest reaches towards the chin and the gaze is inward or towards the toes.',
        benefit:'Calms the brain and helps relieve stress and mild depression. Stimulates the thyroid and prostate glands and abdominal organs. Stretches the shoulders and neck. Tones the legs and buttocks. Improves digestion. Helps relieve the symptoms of menopause. Reduces fatigue and alleviates insomnia. Therapeutic for asthma, infertility, and sinusitis.',
        image: shoulderstand,
        type: HOLD_POSE,
        defaultNum: 30
    }
}

export const TensorflowPointEnum = {
    NOSE : 0,
    LEFT_EYE : 1,
    RIGHT_EYE : 2,
    LEFT_EAR : 3,
    RIGHT_EAR : 4,
    LEFT_SHOULDER : 5,
    RIGHT_SHOULDER : 6,
    LEFT_ELBOW : 7,
    RIGHT_ELBOW : 8,
    LEFT_WRIST : 9,
    RIGHT_WRIST : 10,
    LEFT_HIP : 11,
    RIGHT_HIP : 12,
    LEFT_KNEE : 13,
    RIGHT_KNEE : 14,
    LEFT_ANKLE : 15,
    RIGHT_ANKLE : 16,
}

export const keypointConnections = {
    nose: ['left_ear', 'right_ear'],
    left_ear: ['left_shoulder'],
    right_ear: ['right_shoulder'],
    left_shoulder: ['right_shoulder', 'left_elbow', 'left_hip'],
    right_shoulder: ['right_elbow', 'right_hip'],
    left_elbow: ['left_wrist'],
    right_elbow: ['right_wrist'],
    left_hip: ['left_knee', 'right_hip'],
    right_hip: ['right_knee'],
    left_knee: ['left_ankle'],
    right_knee: ['right_ankle']
}

export const classificationEnum = {
    Chair: 0,
    Cobra: 1,
    Dog: 2,
    No_Pose: 3,
    Shoulderstand: 4,
    Traingle: 5,
    Tree: 6,
    Warrior: 7,
    Warrior2: 8,
}
